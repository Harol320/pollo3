import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBKJ2lTogRyuKLM9HD5YwGqTaXSu_7AzTs",
  authDomain: "base-34631.firebaseapp.com",
  projectId: "base-34631",
  storageBucket: "base-34631.firebasestorage.app",
  messagingSenderId: "51947527201",
  appId: "1:51947527201:web:6502d9498a58660f129760",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Inicializar Firestore

const App = () => {
  const [numPollos, setNumPollos] = useState("");
  const [tipoAlimento, setTipoAlimento] = useState("grano");
  const [dias, setDias] = useState("");
  const [resultado, setResultado] = useState(null);

  const calcularComida = async () => {
    if (!numPollos || !dias) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    const comidaPorPolloPorDia = tipoAlimento === "grano" ? 0.15 : 0.12; // kg por pollo por día
    const totalComida = numPollos * comidaPorPolloPorDia * dias;

    setResultado(totalComida.toFixed(2));

    // Guardar los datos en Firestore
    try {
      await addDoc(collection(db, "calculos"), {
        numPollos: parseInt(numPollos),
        tipoAlimento,
        dias: parseInt(dias),
        totalComida: totalComida.toFixed(2),
        fecha: new Date().toISOString(),
      });
      console.log("Cálculo guardado correctamente en Firestore");
    } catch (error) {
      console.error("Error al guardar el cálculo en Firestore: ", error);
    }
  };

  const limpiarCampos = () => {
    setNumPollos("");
    setTipoAlimento("grano");
    setDias("");
    setResultado(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calculadora de Comida para Pollos</Text>

      <Text>Número de pollos:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={numPollos}
        onChangeText={setNumPollos}
      />

      <Text>Tipo de alimento:</Text>
      <TextInput
        style={styles.input}
        value={tipoAlimento}
        onChangeText={setTipoAlimento}
      />

      <Text>Días:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={dias}
        onChangeText={setDias}
      />

      <Button title="Calcular" onPress={calcularComida} />
      <Button title="Limpiar" color="gray" onPress={limpiarCampos} />

      {resultado && <Text style={styles.result}>Total de comida necesaria: {resultado} kg</Text>}
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "white",
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default App;
