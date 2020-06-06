import React, { useEffect, useState } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, ImageBackground, Image, StyleSheet, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import PickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUFResponse {
  sigla: string;
};

interface IBGECityResponse {
  nome: string;
}

const Home = () => {
    const [UFs, setUFs] = useState<string[]>([]);
    const [selectedUF, setSelectedUF] = useState('0');
    const [cities, setCities] = useState<string[]>([]);
    const [selectedCity, setSelectedCity] = useState('0');

    const navigation = useNavigation();

    function handleNavigateToPoints() {
        navigation.navigate('Points', {
          uf: selectedUF,
          city: selectedCity
        });
    }

    useEffect(() => {
      axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        .then(response => {
          const ufInitials = response.data.map(uf => uf.sigla).sort();
          setUFs(ufInitials);
        })
    }, []);

    useEffect(() => {
      if(selectedUF !== '0') {
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
          .then(response => {
            setCities(response.data.map(city => city.nome));
          });
          setSelectedCity('0');
      }
    }, [selectedUF]);
    
    function selectUfHandler(uf: string) {
      setSelectedUF(uf);
    }

    function selectCityHandler(city: string) {
      setSelectedCity(city);
    }

    return (
        <ImageBackground 
            style={styles.container} 
            source={require('../../assets/home-background.png')}
            imageStyle={{ width: 274, height: 368 }}
        >
            <View style={styles.main}>
                <Image source={require('../../assets/logo.png')}/>
                <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
            </View>

            <View style={styles.footer}>
                <PickerSelect
                  onValueChange={(value) => selectUfHandler(value)}
                  items={UFs.map(uf => {return {label: uf, value: uf}})}
                  placeholder={{label: "Selecione uma UF", value: '0'}}
                  style={{inputAndroid: styles.input}}
                  useNativeAndroidPickerStyle={false}
                />
                <PickerSelect
                  onValueChange={(value) => selectCityHandler(value)}
                  items={cities.map(city => {return {label: city, value: city}})}
                  placeholder={{label: "Selecione uma cidade", value: '0'}}
                  style={{inputAndroid: styles.input}}
                  useNativeAndroidPickerStyle={false}
                  value={selectedCity}
                />
                <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                    <View style={styles.buttonIcon}>
                        <Text>
                            <Icon name="arrow-right" color="#FFF" size={24} />
                        </Text>
                    </View>
                    <Text style={styles.buttonText}>
                        Entre
                    </Text>
                </RectButton>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  
    select: {},
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });

export default Home;