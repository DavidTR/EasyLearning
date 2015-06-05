#pragma strict
import System.Text.RegularExpressions;

var pref : GameObject;
var camara : GameObject;
var onlyNumbers1 : String;
var onlyNumbers2 : String;
var vector : Vector3[];
var munyecos : GameObject[];
var insertado : int = 0;
var yaEsta : int = 0;

function Start () {
    //objeto.transform.position = Vector3 (x, y, 0);
}

function Update () {
	if(insertado){
		InstanciarYretrasar();
		insertado = 0;
		yaEsta = 1;
	}
	
	if(yaEsta) Mover();
	
	
}

function OnGUI() {
	onlyNumbers1= GUI.TextField(new Rect(30, 110, 30, 20), onlyNumbers1, 3);
	onlyNumbers1= Regex.Replace(onlyNumbers1, "[^0-9]", "");
	
	onlyNumbers2= GUI.TextField(new Rect(110, 190, 30, 20), onlyNumbers2, 3);
	onlyNumbers2= Regex.Replace(onlyNumbers2, "[^0-9]", "");
	
	if (GUI.Button(new Rect(30, 220, 50, 30), "Click") && !yaEsta)
       insertado = 1;
}

function InstanciarYretrasar(){
	vector = new Vector3[4];
	munyecos = new GameObject[4];
	vector[0] = Vector3(50, 0, 50);
	vector[1] = Vector3(50, 0, -50);
	vector[2] = Vector3(-50, 0, 50);
	vector[3] = Vector3(-50, 0, -50);
	for(var i = 0 ; i < vector.length ; i++){	
		munyecos[i] = Instantiate(pref, vector[i], Quaternion.identity) as GameObject;
		munyecos[i].transform.parent = camara.transform;
		yield WaitForSeconds(2);
	}
}

function Mover(){
	var speed : float = 50.0;
	var target : Vector3;
	var x : int;
	var y : int;
	var z : int;
	
	var step : float = speed * Time.deltaTime;
	
	for(var i = 0 ; i < vector.length ; i++){
		x = munyecos[i].transform.position.x;
		y = munyecos[i].transform.position.y;
		z = munyecos[i].transform.position.z;
		target = new Vector3(x, y, z);
		munyecos[i].transform.position = Vector3.MoveTowards(munyecos[i].transform.position, new Vector3(x, y, z+10), step);
	}
}
	