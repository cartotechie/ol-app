// ADMIN level div_name attribute equal to province 
const province = 'div_name'
const commune = 'dist_name'
const powerplantName = 'name'
const upezilla = 'name_en'
let flood_exposure 
let floodExposureClass = 'class'

const alias ={'class':'Flood exposure'}

let lulcClass ='class_1'

let landslideExposure
let lulc

const featureKeys = ['class', 'class_1', 'class_1_13', 'class_1_14', 'class_1_15', 'class_12'];



const tableAttributes = ['div_name','dist_name','name_en'] 

/// All key to the feature attributes below
const classVariableValues = {
  class :  ['High', 'Low', 'moderate', 'VeryHigh'],
  class_1 :  ['vegetation', 'forest', 'natural', 'water', 'buildings'], 
  class_1_13 : ['Low', 'moderate', 'High', 'VeryHigh'],
  class_1_14 : ['VeryHigh', 'High', 'moderate', 'Low'] ,
  class_1_15 : ['VeryLow', 'Low', 'moderate', 'NoData', 'VeryHigh', 'High'],
  class_12 : ['POJECTrelevant', 'classFOCUS1']}

export{classVariableValues,province,commune,upezilla,featureKeys,tableAttributes}

