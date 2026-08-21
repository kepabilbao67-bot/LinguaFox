import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppColors } from '@/constants/app-theme';
import { useProgress } from '@/hooks/use-progress';
import type { LanguageCode } from '@/types/learning';

const OPTIONS: readonly { code: LanguageCode; label: string; flag: string }[] = [{code:'en',label:'Inglés',flag:'🇬🇧'},{code:'fr',label:'Francés',flag:'🇫🇷'}];
export function LanguageScreen(){const {progress,setLanguage}=useProgress();const choose=(code:LanguageCode):void=>{setLanguage(code);router.replace('/');};return <SafeAreaView style={styles.safe} edges={['top','right','bottom','left']}><View style={styles.page}><Pressable onPress={()=>router.back()}><Text style={styles.back}>‹ Volver</Text></Pressable><Text style={styles.title}>Elige tu idioma</Text><Text style={styles.subtitle}>Tu progreso se guarda por separado para cada idioma.</Text>{OPTIONS.map(option=><Pressable key={option.code} style={[styles.option,progress.idioma===option.code&&styles.selected]} onPress={()=>choose(option.code)}><Text style={styles.flag}>{option.flag}</Text><Text style={styles.label}>{option.label}</Text><Text style={styles.check}>{progress.idioma===option.code?'✓':''}</Text></Pressable>)}</View></SafeAreaView>}
const styles=StyleSheet.create({safe:{flex:1,backgroundColor:AppColors.background},page:{padding:20,gap:14,maxWidth:720,width:'100%',alignSelf:'center'},back:{color:AppColors.primaryBright,fontWeight:'800'},title:{color:AppColors.text,fontSize:28,fontWeight:'900',marginTop:10},subtitle:{color:AppColors.textMuted,marginBottom:12},option:{backgroundColor:AppColors.surface,borderRadius:16,padding:18,flexDirection:'row',alignItems:'center',gap:12},selected:{borderWidth:1,borderColor:AppColors.primary},flag:{fontSize:30},label:{color:AppColors.text,fontSize:18,fontWeight:'800',flex:1},check:{color:AppColors.primaryBright,fontSize:24,fontWeight:'900'}});
