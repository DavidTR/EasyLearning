#pragma strict

/**
	dataInput script: Controls the way the user introduces the numbers to execute a certain math operation.
**/

private var operationSelect : operationSelection;								// Reference to the operationSelection script.
private var mostrarBotones : boolean;											// Boolean variable that controls when can the fields be visible.
@HideInInspector
var operando1 : String;																// First number of the operation.
@HideInInspector
var operando2 : String;																// Second number of the operation.
private var numerosEnRango : boolean;											// Boolean variable that controls whether we have valid numbers or not.
private var restaValida : boolean;													// Boolean variable that controls if the substraction operation returns a positive value (greater than 0).
private var sinNumeros : boolean;												// Boolean variable that controls if the number fields are filled before executing the operation.
private var ventanaAviso : Rect;													// Warning window.
private var hit : RaycastHit;															// Object hit with the collisiion ray.
@HideInInspector
static var num1: int;																	// First number of the operation parsed to integer.
@HideInInspector
static var num2: int;																	// Second number of the operation parsed to integer.


/** 
	Start function: Gets the reference to the operationSelection script, initializes the size of the warning window
**/
function Start () {
	operationSelect = Camera.main.GetComponent.<operationSelection>();
	
	ventanaAviso = new Rect(Screen.width/2-125, Screen.height/2-25, 250, 50);
	numerosEnRango = true;
	restaValida = true;
}

/**
	Update function: If the dataInput form is in position, we let the user introduce the numbers in the fields originated int the OnGUI function.
**/
function Update () {
	if (operationSelect.insertarDatos) {
		mostrarBotones = true;
		operationSelect.insertarDatos = false;
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

/**
	OnGUI function: This function creates the GUI forms, takes the numbers and checks them. If necessary, warning windows will show up.
**/
function OnGUI() {
	if (mostrarBotones) {
			
		operando1 = GUI.TextField(new Rect(Screen.width/3.5 , Screen.height/1.3, 100, 60), operando1, 3);
		operando1 = Regex.Replace(operando1, "[^0-9]", "");
		
		operando2 = GUI.TextField(new Rect(Screen.width/1.9 , Screen.height/1.3, 100, 60), operando2, 3);
		operando2 = Regex.Replace(operando2, "[^0-9]", "");
	
		// Hacer estas coordenadas independientes de la pantalla (relativas a algun objeto del mundo).
		if (GUI.Button(new Rect(Screen.width/1.55 , Screen.height/1.3, 100, 60), "=") && numerosEnRango && !sinNumeros) {
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
		
		if (!numerosEnRango)
			ventanaAviso = GUILayout.Window (1, ventanaAviso, rellenarVentana, "Error: Numeros fuera de rango");
		
		if (!restaValida)
			ventanaAviso = GUILayout.Window (2, ventanaAviso, rellenarVentana, "Error: Resta invalida");
			
		if (sinNumeros)
			ventanaAviso = GUILayout.Window (3, ventanaAviso, rellenarVentana, "Error: No has introducido numeros");
			
		if (GUI.Button(new Rect(Screen.width/2.45 , Screen.height/1.3, 100, 60), operationSelection.tipoOp)) {}
	}
}

/**
	rellenarVentana function: This function is necessary to show the warning message in case they are needed.
**/
function rellenarVentana (indice: int) {

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