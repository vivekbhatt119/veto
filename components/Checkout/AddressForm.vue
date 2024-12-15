<template>
    <div class="address-form p-6">
      <form @submit.prevent="submitAddress">
        <!-- First Name -->
        <b-form-group label="First Name" label-for="firstname">
          <b-form-input
            id="firstname"
            v-model="address.firstname"
            type="text"
            required
          ></b-form-input>
        </b-form-group>
  
        <!-- Last Name -->
        <b-form-group label="Last Name" label-for="lastname">
          <b-form-input
            id="lastname"
            v-model="address.lastname"
            type="text"
            required
          ></b-form-input>
        </b-form-group>
  
        <!-- Company -->
        <b-form-group label="Company" label-for="company">
          <b-form-input id="company" v-model="address.company" type="text"></b-form-input>
        </b-form-group>
  
        <!-- Street -->
        <b-form-group label="Street" label-for="street">
          <b-form-input
            id="street"
            v-model="address.street[0]"
            type="text"
            required
          ></b-form-input>
        </b-form-group>
  
        <!-- City -->
        <b-form-group label="City" label-for="city">
          <b-form-input id="city" v-model="address.city" type="text" required></b-form-input>
        </b-form-group>
  
        <!-- Country Code -->
        <b-form-group label="Country" label-for="country_code">
          <b-form-select
            id="country_code"
            v-model="address.country_code"
            :options="countries"
            @change="fetchRegions"
            required
          ></b-form-select>
        </b-form-group>
  
        <!-- Region -->
        <b-form-group label="Region" label-for="region_id">
          <b-form-select
            id="region_id"
            v-model="address.region_id"
            :options="regions"
            required
          ></b-form-select>
        </b-form-group>
  
        <!-- City -->
        <b-form-group label="Region" label-for="region">
            <b-form-input id="region" v-model="address.region" type="text" required></b-form-input>
        </b-form-group>
  
        <!-- Postcode -->
        <b-form-group label="Postcode" label-for="postcode">
          <b-form-input
            id="postcode"
            v-model="address.postcode"
            type="text"
            required
          ></b-form-input>
        </b-form-group>
  
        <!-- Telephone -->
        <b-form-group label="Telephone" label-for="telephone">
          <b-form-input
            id="telephone"
            v-model="address.telephone"
            type="text"
            required
          ></b-form-input>
        </b-form-group>
  
        <!-- Save in Address Book -->
        <b-form-checkbox v-model="address.save_in_address_book">
          Save in Address Book
        </b-form-checkbox>
  
        <b-button type="submit" variant="primary" class="mt-3">
          Submit Address
        </b-button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        address: {
          city: "",
          company: "",
          country_code: "",
          custom_attributes: [],
          fax: "",
          firstname: "",
          lastname: "",
          middlename: "",
          postcode: "",
          prefix: "",
          region: "",
          region_id: null,
          save_in_address_book: false,
          street: [""],
          suffix: "",
          telephone: "",
          vat_id: "",
        },
        countries: [],
        regions: [],
      };
    },
    methods: {
      async fetchCountries() {
        const QUERY = `
          query {
            countries {
              id
              two_letter_abbreviation
              full_name_english
              available_regions {
                id
                code
                name
              }
            }
          }
        `;
  
        try {
          const response = await this.$graphqlCall(QUERY);
          this.countries = response.data.data.countries.map((country) => ({
            value: country.two_letter_abbreviation,
            text: country.full_name_english,
            regions: country.available_regions || [],
          }));
        } catch (error) {
          console.error("Error fetching countries:", error);
        }
      },
      fetchRegions() {
        const selectedCountry = this.countries.find(
          (country) => country.value === this.address.country_code
        );
        this.regions = selectedCountry?.regions.map((region) => ({
          value: region.id,
          text: region.name,
        })) || [];
      },
      submitAddress() {
        console.log("Address submitted", this.address);
      },
    },
    async mounted() {
      await this.fetchCountries();
    },
  };
  </script>
  
  <style scoped>
  </style>
  