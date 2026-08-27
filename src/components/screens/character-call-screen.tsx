import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppColors } from '@/constants/app-theme';
import { useProgress } from '@/hooks/use-progress';
import { speakText, stopSpeaking } from '@/services/speech';
import type { Character } from '@/types/learning';

export function CharacterCallScreen({ character }: { character: Character }) {
  const { registerCharacterInteraction } = useProgress();
  const [subtitle] = useState(character.greeting);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [notice, setNotice] = useState('Toca “Escuchar” para oír al personaje.');
  const [wave] = useState(() => new Animated.Value(0.55));

  useEffect(() => {
    registerCharacterInteraction(character.id, 'call');
    const loop = Animated.loop(Animated.sequence([Animated.timing(wave, { toValue: 1, duration: 520, useNativeDriver: true }), Animated.timing(wave, { toValue: .55, duration: 520, useNativeDriver: true })]));
    loop.start();
    return () => { loop.stop(); stopSpeaking(); };
  }, [character.id, registerCharacterInteraction, wave]);

  const speak = (): void => {
    try {
      setNotice(speakText(subtitle, { rate: character.difficulty === 'facil' ? .82 : .94 }) ? 'Reproduciendo voz sintética del personaje.' : 'El audio no está disponible aquí. Puedes seguir practicando con subtítulos.');
    } catch (error: unknown) {
      console.warn('No se pudo iniciar la síntesis de voz.', error);
      setNotice('El audio no está disponible aquí. Puedes seguir practicando con subtítulos.');
    }
  };


  return <SafeAreaView style={styles.safeArea} edges={['top','right','bottom','left']}><View style={styles.page}>
    <Pressable onPress={() => router.back()}><Text style={styles.back}>‹ Volver al chat</Text></Pressable>
    <Text style={styles.modeLabel}>🎧 PRÁCTICA DE ESCUCHA</Text><View style={styles.avatarCircle}><Text style={styles.avatar}>{character.avatar}</Text></View><Text style={styles.name}>{character.name}</Text><Text style={styles.role}>{character.personality}</Text>
    <View style={styles.waves}>{[0,1,2,3,4].map((item) => <Animated.View key={item} style={[styles.wave, { transform:[{scaleY:wave}], opacity:.5 + item*.1 }]} />)}</View>
    {subtitlesEnabled ? <View style={styles.subtitleBox}><Text style={styles.subtitleLabel}>SUBTÍTULOS</Text><Text selectable style={styles.subtitle}>{subtitle}</Text></View> : null}
    <Text style={styles.notice}>{notice}</Text>
    <View style={styles.controls}><Pressable style={styles.control} onPress={speak}><Text style={styles.controlIcon}>🔊</Text><Text style={styles.controlText}>Escuchar</Text></Pressable><View style={styles.control}><Text style={styles.controlIcon}>💬</Text><Switch value={subtitlesEnabled} onValueChange={setSubtitlesEnabled} trackColor={{ false: AppColors.disabled, true: AppColors.primary }}/><Text style={styles.controlText}>Subtítulos</Text></View></View>
    <Pressable style={styles.hangup} onPress={() => router.back()}><Text style={styles.hangupText}>Terminar práctica</Text></Pressable>
    {/* Integración futura: voz generada propia con librería original. No se usa ninguna API de terceros en V1. */}
  </View></SafeAreaView>;
}
const styles = StyleSheet.create({safeArea:{flex:1,backgroundColor:AppColors.background},page:{flex:1,alignItems:'center',padding:22,gap:12},back:{alignSelf:'flex-start',color:AppColors.primaryBright,fontWeight:'800'},modeLabel:{color:AppColors.textMuted,fontWeight:'900',fontSize:11,letterSpacing:1,marginTop:12},avatarCircle:{width:168,height:168,borderRadius:84,backgroundColor:AppColors.surfaceRaised,justifyContent:'center',alignItems:'center',borderWidth:3,borderColor:AppColors.primary},avatar:{fontSize:82},name:{color:AppColors.text,fontSize:27,fontWeight:'900'},role:{color:AppColors.textMuted,textAlign:'center'},waves:{height:46,flexDirection:'row',alignItems:'center',gap:7},wave:{height:18,width:7,borderRadius:4,backgroundColor:AppColors.primaryBright},subtitleBox:{backgroundColor:AppColors.surface,borderRadius:16,padding:16,width:'100%',maxWidth:520},subtitleLabel:{color:AppColors.primaryBright,fontWeight:'900',fontSize:11,letterSpacing:1},subtitle:{color:AppColors.text,fontSize:17,lineHeight:24,marginTop:6,textAlign:'center'},notice:{color:AppColors.textMuted,textAlign:'center',minHeight:36},controls:{flexDirection:'row',width:'100%',justifyContent:'space-around',gap:8},control:{alignItems:'center',gap:5,flex:1},controlIcon:{fontSize:27},controlText:{color:AppColors.text,fontSize:12,fontWeight:'700'},hangup:{backgroundColor:AppColors.danger,borderRadius:999,paddingVertical:15,paddingHorizontal:42,marginTop:'auto',marginBottom:10},hangupText:{color:AppColors.text,fontWeight:'900'}});
