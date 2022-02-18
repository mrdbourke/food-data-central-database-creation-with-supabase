import { fdc_ids } from "./constants.js";
import { supabase } from "./supabaseClient.js";
import { reverse_map } from "./utils.js";

// Setup constants and variables
const fdc_ids_string_index = reverse_map(fdc_ids);
const selectElement = document.querySelector(".food_select_list");
var food_selection, select_option;

// Create select options dynamically (from list of available foods)
Object.values(fdc_ids).sort().forEach(fdc_id_food_name_string => {
    select_option = document.createElement("option");
    select_option.textContent = fdc_id_food_name_string;
    // console.log(fdc_id_food_name_string);
    selectElement.add(select_option);
})

// Get food data on change of select box
selectElement.addEventListener("change", (event) => {
    food_selection = event.target.value.toLowerCase();
    getFoodData();
    console.log(`Selected food name: ${food_selection}`)
    console.log(`Target food name: ${fdc_ids_string_index[food_selection]}`)
})

// Get data from Supabase
async function get_food_data_from_supabase(id) {
    let { data, error } = await supabase
        .from("food_data_central_nutrition_data_test")
        .select("*")
        .eq("fdc_id", id)

    if (error) {
        console.log(error);
        return;
    }
    console.log("logging data");
    console.log("data[0]")
    return data[0];
}

// Make a function to get food data and then update the DOM elements
async function getFoodData() {
    var startTime = performance.now()

    const target_food_code = fdc_ids_string_index[food_selection];
    const data = await get_food_data_from_supabase(target_food_code);
    // You can get data from "data" using JavaScript destructuring
    console.log(data);
    const food_name = data["food"];
    console.log(food_name);
    document.getElementById("food_name").textContent = food_name;

    // Get nutrient values
    const protein_amount = data["protein"];
    console.log(`Protein amount: ${protein_amount}`)
    document.getElementById("protein_amount").textContent = protein_amount + "g";

    const carbohydrate_amount = data["carbohydrate_by_difference"];
    console.log(`Carbohydrate amount: ${carbohydrate_amount}`)
    document.getElementById("carbohydrate_amount").textContent = carbohydrate_amount + "g";

    const fat_amount = data["total_lipid_fat"];
    console.log(`Fat amount: ${fat_amount}`)
    document.getElementById("fat_amount").textContent = fat_amount + "g";

    var endTime = performance.now()

    // console.log(`Call to getFoodData took ${endTime - startTime} milliseconds`)
    document.getElementById("time_taken").textContent = `${(endTime - startTime) / 1000} seconds`
}