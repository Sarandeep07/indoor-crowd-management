var source = new EventSource('http://127.0.0.1:5001/crowd-count');
var textElement = document.getElementById("text1");
var textElement1 = document.getElementById("text2");

source.onmessage = function(event) {
    var crowdCount = parseInt(event.data);
    document.getElementById("counter").innerHTML = crowdCount;
    if (crowdCount > 5){
        video1.style.borderColor = 'red';
        video2.style.borderColor = "green";
        textElement.innerHTML = "DANGER AHEAD ! Follow Other path";
      }
      if (crowdCount < 5){
        counter.style.color = "green";
        video1.style.borderColor = "green";
        textElement.innerHTML = "GOOD TO GO";
      }
      if (crowdCount === 0){
        counter.style.color = "green";
        video1.style.borderColor = 'grey';
        video2.style.borderColor = 'grey';
        textElement.innerHTML = "IDEAL";
      }
};
var source1 = new EventSource('http://127.0.0.1:8001/crowd-count');
source1.onmessage = function(event) {
    var crowdCount = parseInt(event.data);
    document.getElementById("counter1").innerHTML = crowdCount;
    if (crowdCount > 5){
      video2.style.borderColor = 'red';
      video1.style.borderColor = "green";
      textElement1.innerHTML = "DANGER AHEAD ! Follow Other path";
    }
    if (crowdCount < 5){
      counter.style.color = "green";
      video2.style.borderColor = "grey";
      textElement1.innerHTML = "GOOD TO GO";
    }
    if (crowdCount === 0){
      textElement1.innerHTML = "IDEAL";
    }
};
