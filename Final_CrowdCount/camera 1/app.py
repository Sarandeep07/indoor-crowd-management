from flask import Flask, render_template, Response
from flask_cors import CORS
import cv2
import numpy as np
import threading
from queue import Queue
from ultralytics import YOLO

app = Flask(__name__)
CORS(app)
camera1 = cv2.VideoCapture(0)
model = YOLO("yolov8n.pt")
q1 = Queue()

def process_camera(camera, q):
    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            # detect persons in the frame using YOLO
            results = model.predict(frame, device="mps")
            result = results[0]
            bboxes = np.array(result.boxes.xyxy.cpu(), dtype ="int")
            classes = np.array(result.boxes.cls.cpu(), dtype ="int")
            # filter out all other classes except person (class id 0)
            mask = classes == 0
            bboxes = bboxes[mask]
            crowd_count=0
            # draw bounding boxes and count people
            for bbox in bboxes:
                (x,y ,x2, y2) =  bbox
                cv2.rectangle(frame , (x ,y),(x2,y2) , (0, 255,0),2)
                crowd_count = len(bboxes)
                cv2.putText(frame,"Crowd Count: "+str(crowd_count),(20,30),cv2.FONT_HERSHEY_DUPLEX,0.95,(0,0,255),1)
            # convert the frame to bytes and yield it with the crowd count
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
            # put crowd count in queue
            q.put(crowd_count)

@app.route('/')
def index():
    return render_template('')

@app.route('/video1')
def video1():
    return Response(process_camera(camera1, q1), mimetype='multipart/x-mixed-replace; boundary=frame')

def generate_crowd_count():
    while True:
        # get crowd counts from both queues and add them up
        crowd_count = q1.get()
        yield 'data: %s\n\n' % str(crowd_count)


@app.route('/crowd-count')
def crowd_count1():
    return Response(generate_crowd_count(), mimetype='text/event-stream')

if __name__ == "__main__" :
    # start the threads for both cameras
    t1 = threading.Thread(target=process_camera, args=(camera1, q1))
    t1.daemon = True
    t1.start()

    # start the thread for generate_crowd_count function
    t = threading.Thread(target=generate_crowd_count)
    t.daemon = True
    t.start()

    # start the Flask app
    app.run(debug=True, port = 8001)