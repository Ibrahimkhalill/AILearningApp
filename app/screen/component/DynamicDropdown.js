import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const DynamicDropdown = ({ onLanguageChange, isEditing, dailyGoal, label ,data }) => {
  const [selectedValue, setSelectedValue] = useState(dailyGoal);
  const [items, setItems] = useState(data);
  const [open, setOpen] = useState(false);

  const handleValueChange = (value) => {
    setSelectedValue(value);
    if (onLanguageChange) {
      onLanguageChange(value); // Call the callback function when value changes
    }
  };

  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open}
        value={selectedValue}
        items={items}
        setOpen={setOpen}
        setValue={setSelectedValue}
        setItems={setItems}
        placeholder={dailyGoal || label}
        style={styles.dropdown}
        dropDownContainerStyle={{
          backgroundColor: "#1E1E1E",
          borderColor: "#333",
        }}
        onChangeValue={handleValueChange} // Use the custom handler to call onLanguageChange
        listMode="SCROLLVIEW"
        arrowIconStyle={{ tintColor: "white" }}
        textStyle={styles.textStyle}
        disabled={!isEditing}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  dropdown: {
    backgroundColor: "#1E1E1E",
    borderColor: "#333",
  },
  textStyle: { color: "white", fontSize: 14 },
});

export default DynamicDropdown;
