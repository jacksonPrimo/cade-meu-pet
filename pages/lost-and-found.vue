<template>
  <v-row>
    <v-col cols="3">
      <span class="filter-title">
        Filtros
      </span>

      <div class="filter mb-3">
        <span class="filter-subtitle">
          Identificação
        </span>
        
        <div>
          <v-text-field
            outlined
            dense
            v-model="name"
            label="Nome"
          ></v-text-field>

          <v-text-field
            outlined
            dense
            v-model="chipId"
            label="Chip Subcutaneo"
          ></v-text-field>
        </div>

      </div>

      <div class="filter">
        <span class="filter-subtitle">
          Endereço
        </span>
        
        <div>
          <v-text-field
            outlined
            dense
            v-model="zipcode"
            label="Cep"
          ></v-text-field>
          <v-subheader class="pl-0">
            Distancia máxima {{zipcodeDistance}}km
          </v-subheader>
          <v-slider
            step="10"
            max="50"
            v-model="zipcodeDistance"
          ></v-slider>
        </div>

      </div>
      
      <div class="filter">
        <span class="filter-subtitle">
          Situação do pet
        </span>
        <div>
          <v-switch
            v-model="found"
            label="Perdido"
          ></v-switch>
          <v-switch
            v-model="lost"
            label="Encontrado"
          ></v-switch>
        </div>
      </div>

      <div class="filter">
        <span class="filter-subtitle">
          Espécie
        </span>
        <div>
          <v-combobox
            :items="['Cachorro', 'Gato', 'Coelho', 'Passaro', 'Outros']"
            multiple
          ></v-combobox>
        </div>
      </div>

      <div class="filter mt-4">
        <span class="filter-subtitle">
          Ordenar por
        </span>
        <div>
          <v-radio-group v-model="sort">
            <v-radio
              label="Atividade"
              value="activity"
            ></v-radio>

            <v-radio
              label="Distance"
              value="distance"
            ></v-radio>
          </v-radio-group>
        </div>
      </div>
    </v-col>
    <v-col cols="9">
      <span class="title">
        Achados e Perdidos
      </span>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'LostAndFoundPage',
  layout: "authenticated",
  data: ()=>({
    name: '',
    chipId: '',
    zipcode: "",
    zipcodeDistance: 0,
    found: true,
    lost: true,
    sort: "activity"
  })
}
</script>

<style lang="scss">
.filter-title, .title {
  font-weight: bold;
  font-size: 24px;
}

.filter-subtitle {
  font-weight: 500;
  font-size: 18px;
}

.filter {
  .v-text-field__details, .v-messages {
    display: none;
  }
}

</style>
