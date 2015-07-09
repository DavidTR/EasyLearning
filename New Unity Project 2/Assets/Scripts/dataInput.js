#pragma strict

@HideInInspector
var operationSelect : operationSelection;
@HideInInspector
var mostrarBotones : boolean;
@HideInInspector
var operando1 : String;
@HideInInspector
var operando2 : String;
@HideInInspector
static var num1: int;
@HideInInspector
static var num2: int;
@HideInInspector
var numerosEnRango : boolean;
private var restaValida : boolean;
private var sinNumeros : boolean;
@HideInInspector
var ventanaAviso : Rect;
@HideInInspector
var hit : RaycastHit;															// Objeto con el que colisiona el rayo.


function Start () {
	operationSelect = Camera.main.GetComponent.<operationSelection>();
	
	// Tamaño de la ventana de aviso de numeros fuera de rango.
	ventanaAviso = new Rect(Screen.width/2-125, Screen.height/2-25, 250, 50);
	numerosEnRango = true;
	restaValida = true;
}

function Update () {
	if (operationSelect.dataIn) {
		mostrarBotones = true;
		operationSelect.dataIn = false;
		GameObject.Find("backButton").GetComponent.<BoxCollider>().enabled = true;
	}
	
	if (Input.GetButtonDown("Fire1")) {
		var ray = Camera.main.ScreenPointToRay(Input.mousePosition);

       if (Physics.Raycast(ray, hit, 100)) {
	       	if (hit.collider.gameObject.name == "backButton") {
	            	mostrarBotones = false;
	            	transform.position = new Vector3 (0, -12, 15);
	            	operationSelect.operacionSeleccionada = false;
	            	GameObject.Find("backButton").GetComponent.<BoxCollider>().enabled = false;
	         }
        }
	}
}

function OnGUI() {
	if (mostrarBotones) {
			
		operando1 = GUI.TextField(new Rect(Screen.width/3.5 , Screen.height/1.3+5, 40, 20), operando1, 3);
		operando1 = Regex.Replace(operando1, "[^0-9]", "");
		
		operando2 = GUI.TextField(new Rect(Screen.width/1.9 , Screen.height/1.3+5, 40, 20), operando2, 3);
		operando2 = Regex.Replace(operando2, "[^0-9]", "");
	
		// Hacer estas coordenadas independientes de la pantalla (relativas a algun objeto del mundo).
		if (GUI.Button(new Rect(Screen.width/1.55 , Screen.height/1.3, 50, 30), "=") && numerosEnRango && !sinNumeros) {
			if (operando1 == "" || operando2 == "")
				sinNumeros = true;
			else {
				num1 = int.Parse(operando1);
				num2 = int.Parse(operando2);
				
				if (num1 < 0 || num1 > 5 || num2 < 0 || num2 > 5)
					numerosEnRango = false;
				else if (operationSelect.tipoOp == "-" && (num1 < num2))
					restaValida = false;
				else 
					Application.LoadLevel("AROperations");
			}
		}
		
		// Si los numeros no estan en el rango correcto se muestra un error.
		if (!numerosEnRango)
			ventanaAviso = GUILayout.Window (1, ventanaAviso, rellenarVentana, "Error: Numeros fuera de rango");
		
		if (!restaValida)
			ventanaAviso = GUILayout.Window (2, ventanaAviso, rellenarVentana, "Error: Resta invalida");
			
		if (sinNumeros)
			ventanaAviso = GUILayout.Window (3, ventanaAviso, rellenarVentana, "Error: No has introducido numeros");
			
		if (GUI.Button(new Rect(Screen.width/2.45 , Screen.height/1.3, 40, 30), operationSelection.tipoOp)) {}
	}
}

// Esta funcion dice lo que la ventana de aviso va a llevar en su interior. Es un simple boton.
function rellenarVentana (indice: int) {

	// Aqui deberia ir un Aceptar, pero es necesario un padding para incluir este mensaje en la ventana, no en el boton. Investigar.
	switch (indice) {
		case 1:
			if (GUILayout.Button (" Introduce numeros entre 0 y 5 "))
				numerosEnRango = true;
			break;
		case 2: 
			if (GUILayout.Button (" Numero 1 debe ser >= numero 2 "))
				restaValida = true;
			break;
		case 3:
			if (GUILayout.Button (" Introduce valores en los campos "))
				sinNumeros = false;
			break;
	}
		
}