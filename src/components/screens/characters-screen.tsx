import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppColors } from '@/constants/app-theme';
import { CHARACTERS } from '@/data/characters';

export function CharactersScreen() {
  return <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'bottom', 'left']}><ScrollView contentContainerStyle={styles.content}>
    <View style={styles.header}><Pressable onPress={() => router.back()}><Text style={styles.back}>‹ Volver</Text></Pressable><Text style={styles.title}>Elige personaje</Text><Text style={styles.subtitle}>Practica con personajes originales y divertidos.</Text></View>
    <View style={styles.grid}>{CHARACTERS.map((character) => <Pressable key={character.id} style={({ pressed }) => [styles.card, pressed && styles.pressed]} onPress={() => router.push(`/character/${character.id}`)}>
      <Text style={styles.avatar}>{character.avatar}</Text><Text style={styles.name}>{character.name}</Text><Text style={styles.topic}>{character.vocabularyFocus}</Text><View style={styles.badge}><Text style={styles.badgeText}>{character.difficulty === 'facil' ? 'Fácil' : 'Medio'}</Text></View>
    </Pressable>)}</View>
  </ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({ safeArea:{flex:1,backgroundColor:AppColors.background},content:{padding:20,paddingBottom:48,maxWidth:720,width:'100%',alignSelf:'center'},header:{gap:8,marginBottom:20},back:{color:AppColors.primaryBright,fontWeight:'800'},title:{color:AppColors.text,fontSize:28,fontWeight:'900'},subtitle:{color:AppColors.textMuted},grid:{flexDirection:'row',flexWrap:'wrap',gap:12},card:{backgroundColor:AppColors.surface,borderRadius:18,padding:16,width:'47%',minHeight:174},avatar:{fontSize:42},name:{color:AppColors.text,fontSize:16,fontWeight:'800',marginTop:8},topic:{color:AppColors.textMuted,fontSize:12,lineHeight:17,marginTop:4,flex:1},badge:{alignSelf:'flex-start',backgroundColor:AppColors.surfaceRaised,borderRadius:999,paddingHorizontal:9,paddingVertical:4,marginTop:9},badgeText:{color:AppColors.primaryBright,fontSize:11,fontWeight:'800'},pressed:{opacity:.75} });
