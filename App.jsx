import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Alert,
  Pressable,
  StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getStorage,
  ref,
  uploadBytes,
  deleteObject,
  list,
} from 'firebase/storage';
import bg from './assets/bg.jpg';

const ImagePickerExample = () => {
  const [imageUri, setImageUri] = useState(bg);
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState([null]);
  const [visible, setVisible] = useState(false);

  const firebaseConfig = {
    apiKey: 'AIzaSyCjJ13sdl0ck3Ww3Q1B_Hh_JSL-lu-y3kY',
    authDomain: 'storage-e8892.firebaseapp.com',
    projectId: 'storage-e8892',
    storageBucket: 'storage-e8892.appspot.com',
    messagingSenderId: '555779583595',
    appId: '1:555779583595:web:cdb33e8cbe6e0c7853cb2e',
    measurementId: 'G-TMQL2SZK6L',
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  //Armazena a imagem para o upload e exibe a imagem
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.uri);
      console.log(result.assets);
    }
  };

  function getRandom(max) {
    return Math.floor(Math.random() * max + 1);
  }

  //Método para realizar upload para o Firebase
  const uploadImage = async () => {
    if (!imageUri) {
      Alert.alert('Selecione uma imagem antes de enviar.');
      return;
    }

    // Create a root reference
    const storage = getStorage();

    var name = getRandom(200);
    // Create a reference to 'mountains.jpg'
    const mountainsRef = ref(storage, name + '.jpg');

    const response = await fetch(imageUri);
    const blob = await response.blob();

    uploadBytes(mountainsRef, blob).then((snapshot) => {
      console.log(snapshot);
      alert('Imagem enviada com sucesso!!');
    });
  };

  //Listar no console as imagens salvas no storage
  async function LinkImage() {
    // Create a reference under which you want to list
    const storage = getStorage();
    const listRef = ref(storage);

    // Fetch the first page of 100.
    const firstPage = await list(listRef, { maxResults: 100 });
    var lista = [];
    firstPage.items.map((item) => {
      var link =
        'https://firebasestorage.googleapis.com/v0/b/' +
        item.bucket +
        '/o/' +
        item.fullPath +
        '?alt=media';
      lista.push(link);
    });
    setImage(lista);
    setVisible(true);
    console.log(image);
  }

  const deleteImage = async (imageRef) => {
    try {
      const storage = getStorage();
      const imageRefObj = ref(storage, imageRef);
      await deleteObject(imageRefObj);
      console.log('Imagem deletada com sucesso');
    } catch (error) {
      console.log('Erro ao deletar imagem', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.link}</Text>
    </View>
  );

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'start',
        marginVertical: 24,
      }}
    >
      <Pressable style={style.button} onPress={pickImage}>
        <Text style={style.textButton}>Enviar uma imagem</Text>
      </Pressable>
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: 200, height: 200, marginVertical: 20 }}
        />
      )}
      {uploading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Pressable
          style={style.button}
          onPress={uploadImage}
          disabled={!imageUri}
        >
          <Text style={style.textButton}>Enviar</Text>
        </Pressable>
      )}

      <View style={{ marginVertical: 8 }} />

      <Pressable style={[style.button, {backgroundColor: '#2E236C'}]} onPress={LinkImage}>
        <Text style={style.textButton}>Ver Imagens</Text>
      </Pressable>

      <View style={{ paddingTop: 24 }} />

      {visible && (
        <FlatList
          style={{ width: '100%', paddingHorizontal: 50 }}
          data={image}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                marginBottom: 20,
                alignItems: 'center',
                flex: 1,
                justifyContent: 'space-between',
                flexDirection: 'row',
                gap: '8px',
              }}
            >
              <Pressable><Image source={{ uri: item }} style={{ width: 50, height: 50 }} /></Pressable>
              <Pressable
                style={[style.buttonStack, {backgroundColor: '#433D8B'}]}
                onPress={() => deleteImage(item)}
              >
                <Text style={style.textButton}>Remover imagem</Text>
              </Pressable>
            </View>
          )}
        />
      )}
    </View>
  );
};

const style = StyleSheet.create({
  button: {
    width: 260,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#17153B',
    borderRadius: 8,
  },

  buttonStack: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 180,
    height: 40,
    backgroundColor: 'blue',
    borderRadius: 8,
  },

  textButton: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
});

export default ImagePickerExample;
