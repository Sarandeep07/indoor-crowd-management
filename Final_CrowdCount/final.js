var source = new EventSource('http://127.0.0.1:5001/crowd-count');
source.onmessage = function(event) {
    var crowdCount = parseInt(event.data);
    // Update the crowd count display on both videos
    document.getElementById("counter").innerHTML = crowdCount;
    if (crowdCount > 4){
        video1.style.borderColor = 'red';
        video2.style.borderColor = "green";
      }
      if (crowdCount < 4){
        counter.style.color = "green";
        // video1.style.borderColor = 'green';
      }
      if (crowdCount === 0){
        counter.style.color = "green";
        video1.style.borderColor = 'grey';
        video2.style.borderColor = 'grey';
      }
};
var source1 = new EventSource('http://127.0.0.1:8001/crowd-count');
source1.onmessage = function(event) {
    var crowdCount = parseInt(event.data);
    // Update the crowd count display on both videos
    document.getElementById("counter1").innerHTML = crowdCount;
};
