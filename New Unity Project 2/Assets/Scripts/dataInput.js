#pragma strict

var operationSelect : operationSelection;
var mostrarBotones : boolean;
var tipoOperacion : String;
var operando1 : String;
var operando2 : String;
var x: float;
var y: float;
var z: float;

function Start () {
	operationSelect = Camera.main.GetComponent.<operationSelection>();
	// Ver tipo de operacion y guardar el simbolo en una variable para colocarlo en el boton.
	tipoOperacion = "+";
	

}

function Update () {
	if (operationSelect.dataInput) {
		mostrarBotones = true;
		x = transform.position.x;
		y = transform.position.y;
		z = transform.position.z;
		print(x+ " "+y + " " +z);
		operationSelect.dataInput = false;
	}
}

function OnGUI() {
	if (mostrarBotones) {
	

		operando1 = GUI.TextField(new Rect(Screen.width/1.9 , Screen.height/1.3+5, 40, 20), operando1, 3);
		operando1 = Regex.Replace(operando1, "[^0-9]", "");
		
		operando2 = GUI.TextField(new Rect(Screen.width/3.5 , Screen.height/1.3+5, 40, 20), operando2, 3);
		operando2 = Regex.Replace(operando2, "[^0-9]", "");
			
		// Hacer estas coordenadas independientes de la pantalla (relativas a algun objeto del mundo).
		if (GUI.Button(new Rect(Screen.width/1.55 , Screen.height/1.3, 50, 30), "="))
			print("=");
		
		
		if (GUI.Button(new Rect(Screen.width/2.45 , Screen.height/1.3, 40, 30), tipoOperacion))
			print("+");
	}
}