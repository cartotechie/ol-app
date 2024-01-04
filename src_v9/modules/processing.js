import { featureKeys, classVariableValues } from './variables'

// Function to count occurrences of a value in an array
function countOccurrences(arr, value) {
  return arr.reduce((count, current) => (current === value ? count + 1 : count), 0);
}

function countOccurrencesSet(arr, setOfValues) {
  const occurrences = new Map();

  arr.forEach((element) => {
    if (setOfValues.has(element)) {
      occurrences.set(element, (occurrences.get(element) || 0) + 1);
    }
  });

  return occurrences;
}

function countFeatures(features, property, selectedValues) {
  const uniqueValues = new Set();

  features.forEach(feature => {
    const value = feature.get(property);
    selectedValues.push(value);
    uniqueValues.add(value);
  });

  return uniqueValues.size;
}

function createUniqueAttributes(features, property) {


  const uniqueAttributeSet = new Set()
  const uniqueFeatures = features.filter(feature => {
    const attributeValue = feature.get(property)
    if (!uniqueAttributeSet.has(attributeValue)) {
      uniqueAttributeSet.add(attributeValue)
      return true
    } else {
      return false
    }
  })
  return uniqueFeatures

}

function aggregateFeaturesByAtt(features) {
  const valueCounts = {};



  features.forEach(feature => {
    featureKeys.forEach(key => {
      const value = feature.get(key);
      valueCounts[key] = { ...(valueCounts[key] || {}), [value]: (valueCounts[key]?.[value] || 0) + 1 };
    });
  });

  return valueCounts
}

function aggregateFeaturesByAtt1(features, property) {
  //const uniqueValues = new Set();
  let newValuesObject = {}
  let uniqueValuesSet = new Set();
  const allValues = []

  features.forEach(feature => {
    const value = feature.get(property);
    allValues.push(value)
    uniqueValuesSet.add(value);
  });

  console.log(uniqueValuesSet)
  //uniqueValuesSet = Array.from(uniqueValuesSet)
  console.log(property)
  console.log(allValues)
  console.log(uniqueValuesSet)

  const occurrencesMap = countOccurrencesSet(allValues, uniqueValuesSet);

  occurrencesMap.forEach((count, value) => {
    console.log(`The value ${value} appears ${count} times in the array.`);
    newValuesObject[property] = property
  newValuesObject[value] = count
  });

  
  console.log(newValuesObject)
  return newValuesObject
}

function updateObjectKeyValue(key, valueCounts, classVariableValues) {
  if (!(key in valueCounts)) {
    console.error(`Key '${key}' not found in valueCounts.`);
    return;
  }

  const objectKeyValue = valueCounts[key];

  // Check if classVariableValues is an object
  if (typeof classVariableValues !== 'object' || classVariableValues === null) {
    console.error('classVariableValues is not an object.');
    return;
  }

  // Iterate over the keys of classVariableValues
  for (const classVariableKey in classVariableValues) {
    const classVariableValue = classVariableValues[classVariableKey];

    // Check if the current classVariableValue matches the current key in valueCounts
    if (classVariableKey === key) {
      // Set the value at the specified index in objectKeyValue to 0
      objectKeyValue[classVariableValue[3]] = 0;

      // Iterate over items in the current classVariableValue
      for (const item of classVariableValue) {
        // Check if the item exists in objectKeyValue
        if (!Object.keys(objectKeyValue).includes(item)) {
          // If it doesn't exist, set its value to 0
          objectKeyValue[item] = 0;
        }
        // You can add an else branch here if needed
      }
    }
  }

  return objectKeyValue;
}




export { countFeatures, createUniqueAttributes, aggregateFeaturesByAtt,updateObjectKeyValue }