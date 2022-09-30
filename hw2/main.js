//Initialize anchor window
var anchor = document.getElementsByClassName("anchor")[0]; 
var anchored = true;
//Initialize audience window
var audience = document.getElementsByClassName("audience")[0]; 

//Prepare a list of audience
var cnt = prompt("Enter a number (1 ~ 15)") - 1;
if (!(0 <= cnt && cnt <= 14))
  cnt = 14;

var list = ["老皮", "BMO", "泡泡糖公主", "冰霸王", "阿鵝", "腫泡泡公主", 
    "薄荷糖管家", "艾薇爾", "彩虹姐姐", "檸檬公爵", "火焰公主", "糖果人",
    "蝸牛", "寶妹"];

var images = ["jake.webp", "bmo.webp", "bubblegum.png",
    "king.webp", "penguin.png", "lumpy.png", "mint.jpg", 
    "vampire.png", "unicorn.gif", "lemon.jpg", "flame.png", 
    "candy.jpg", "snail.jpg", "fionna.jpg"];

//Prepare audience index
var cur_list = new Array(14).fill(0);

// Helper function (swap)
var swap = function(a, b){

  [a.getElementsByClassName("profile")[0].src, b.getElementsByClassName("profile")[0].src] =
  [b.getElementsByClassName("profile")[0].src, a.getElementsByClassName("profile")[0].src];

  [a.getElementsByClassName("name")[0].textContent, b.getElementsByClassName("name")[0].textContent] =
  [b.getElementsByClassName("name")[0].textContent, a.getElementsByClassName("name")[0].textContent];

  [a.id, b.id] = [b.id, a.id];
}

//Helper function (adjust)
var adjust = function(a, b, c, d, e){
  var people = audience.getElementsByClassName("person");

  audience.style.width = a;
  for(let i = 0; i < people.length; i++){
    people[i].style.width = b;
    people[i].style.height = c;
  }

  for(let i = 1; i <= cnt % d; i++)
    people[cnt - i].style.width = e;
}

//Helper function (pruge)
var purge = function(person){
  anchor.style.display = "block"; 
  person.remove();
  anchored = true;
  cnt--;
}

//Audience arrangement
var audience_arrange = function(){
  if (anchored){
      if (cnt <= 8)
        adjust("35%", "45%", "30%", 2, "60%");
      else  
        adjust("40%", "30%", "30%", 3, "45%");
  }

  else{
      if (cnt <= 6)
        adjust("100%", "25%", "45%", 3, "30%");
      else if (cnt <= 8)
        adjust("100%", "20%", "45%", 4, "25%");
      else
        adjust("100%", "18%", "45%", 5, "23%");
    }
}

var anchor_arrange = function(){
  if (cnt == 0){
    anchor.style.width = "100%";
    audience.style.display = "none";
  }
  else{
    anchor.style.width = "65%";
    audience.style.display = "flex";
  }
}

//Cancel event function
var Cancel = function(cancel){
  cancel.addEventListener("click", 
  function(){
    let name = cancel.parentElement.getElementsByClassName
      ("name")[0].textContent;
    cur_list[list.indexOf(name)] = 0;
    cancel.parentElement.remove();
    cnt --;

    // Keep last person anchored
    if ((!anchored) && (cnt == 1)){
      var person_a = anchor.getElementsByClassName("person")[0]; 
      var person_b = audience.getElementsByClassName("person")[0];

      swap(person_a, person_b);
      purge(person_b);
    }

    anchor_arrange();
    audience_arrange();
  })
}

var Toolbar = function(toolbar){

  toolbar.addEventListener("click", 
  function(){
    if (cnt == 0)
      return;
    var person_a = toolbar.parentElement;

    if (person_a.parentElement.className == "anchor"){
      var person_b = add(list[0], images[0]);
      swap(person_a, person_b);
      anchor.style.display = "none";
      anchored = false;       
      cnt ++; 
    }

    else {
      var person_b = anchor.getElementsByClassName("person")[0]; 
      swap(person_a, person_b);

      if(anchored == false)
        purge(person_a);
    }
    anchor_arrange();
    audience_arrange();
  })
}

//Create an audience 
var create = function(){
  let node = document.createElement("div");
  node.setAttribute("class", "person");
  node.innerHTML = 
    document.getElementById("finn").innerHTML;

  let cancel = node.getElementsByClassName("cancel")[0];
  let toolbar = node.getElementsByClassName("toolbar")[0];

  // Arrange audience
  Cancel(cancel);
  Toolbar(toolbar);
  return node;
}

//Add an audience
var add = function(name, image){
  let node = create();
  audience.appendChild(node);
  node.getElementsByClassName("name")[0].textContent = name;
  node.getElementsByClassName("profile")[0].src = "./images/" + image;
  return node;
}

//Initialize audience on demand
for (let i = 0; i < cnt; i++){
  add(list[i], images[i]);
  cur_list[i] = 1;
}

//Initialize Finn
Cancel(anchor.getElementsByClassName("cancel")[0]);
Toolbar(anchor.getElementsByClassName("toolbar")[0]);

anchor_arrange();
audience_arrange();

//Button Add member
var button = document.getElementById("add");
button.addEventListener("click", 
  function(){
    for (let i = 0; i < 14; i++){
      if(cur_list[i] == 0){
        add(list[i], images[i]);
        cur_list[i] = 1;
        cnt ++;
        break;
      }
    }
    anchor_arrange();
    audience_arrange();
  })

//Update time function
var update_time = function(){
  var today = new Date();
  var time = today.getHours() + ":" + today.getMinutes();

  if (today.getMinutes() < 10)
    var time = today.getHours() + ":0" + today.getMinutes();

  document.getElementsByClassName("timestamp")[0].textContent = 
    time + " | Web Programming"; 
  setTimeout(update_time, 1000);
}

update_time();