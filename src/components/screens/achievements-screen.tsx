import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ACHIEVEMENTS } from '@/data/achievements';
import { useProgress } from '@/hooks/use-progress';
import { AppColors } from '@/constants/app-theme';
export function AchievementsScreen(){const {progress}=useProgress();return <SafeAreaView style={s.safe}><ScrollView contentContainerStyle={s.page}><Pressable onPress={()=>router.back()}><Text style={s.back}>‹ Volver</Text></Pressable><Text style={s.title}>Logros</Text>{ACHIEVEMENTS.map(a=>{const date=progress.logrosDesbloqueados[a.id];return <View key={a.id} style={[s.card,!date&&s.locked]}><Text style={s.icon}>{date?a.icono:'🔒'}</Text><View style={s.copy}><Text style={s.name}>{a.titulo}</Text><Text style={s.description}>{a.descripcion}</Text>{date?<Text style={s.date}>Desbloqueado: {new Date(date).toLocaleDateString('es-ES')}</Text>:null}</View></View>})}</ScrollView></SafeAreaView>}
const s=StyleSheet.create({safe:{flex:1,backgroundColor:AppColors.background},page:{padding:20,gap:12},back:{color:AppColors.primaryBright,fontWeight:'800'},title:{color:AppColors.text,fontSize:28,fontWeight:'900',marginBottom:8},card:{backgroundColor:AppColors.surface,borderRadius:16,padding:16,flexDirection:'row',gap:12},locked:{opacity:.45},icon:{fontSize:30},copy:{flex:1},name:{color:AppColors.text,fontWeight:'800',fontSize:17},description:{color:AppColors.textMuted,marginTop:3},date:{color:AppColors.primaryBright,fontSize:12,marginTop:7}});
