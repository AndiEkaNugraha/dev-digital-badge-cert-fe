import {
   getDefaultFont,
   DEFAULT_FONT_NAME,
 } from "@/packages/common";
 
export const fontObjList = [
   {
     fallback: false,
     label: 'Montserrat-Black',
     url: '/fonts/Montserrat-Black.otf'
   },
   {
     fallback: true,
     label: 'Montserrat-Bold',
     url: '/fonts/Montserrat-Bold.otf'
   },
   {
     fallback: false,
     label: 'Montserrat-ExtraBold',
     url: '/fonts/Montserrat-ExtraBold.otf'
   },
   {
     fallback: false,
     label: 'Montserrat-ExtraLight',
     url: '/fonts/Montserrat-ExtraLight.otf'
   },
   {
     fallback: false,
     label: 'Montserrat-Light',
     url: '/fonts/Montserrat-Light.otf'
   },
   {
     fallback: false,
     label: 'Montserrat-Medium',
     url: '/fonts/Montserrat-Medium.otf'
   },
   {
     fallback: false,
     label: 'Montserrat-Regular',
     url: '/fonts/Montserrat-Regular.otf'
   },
   {
     fallback: false,
     label: 'Montserrat-SemiBold',
     url: '/fonts/Montserrat-SemiBold.otf'
   },
   {
     fallback: false,
     label: 'Montserrat-Thin',
     url: '/fonts/Montserrat-Thin.otf'
   },
   {
     fallback: false,
     label: DEFAULT_FONT_NAME,
     data: getDefaultFont()[DEFAULT_FONT_NAME].data,
   },
 ];