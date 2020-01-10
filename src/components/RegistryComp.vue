<template>
  <v-container>
    <v-row align="center">
      <v-date-picker
        v-model="date_"
        full-width
        :landscape="$vuetify.breakpoint.smAndUp"
        class="mt-4"
      ></v-date-picker>
    </v-row>
    <br/>

    <v-row>
      <v-col
        cols="3"
      >
        <v-text-field label="Weight" v-model="weight_" clearable type="number" suffix="kg"></v-text-field>
      </v-col>
      <v-col
        cols="3"
      >
        <v-text-field label="Body Fat" v-model="fat_" type="number" clearable suffix="%"></v-text-field>
      </v-col>
      <v-col
        cols="3"
      >
        <v-text-field label="Jump rope" v-model="jumprope_" type="number" clearable suffix="min"></v-text-field>
      </v-col>
      <v-col
        cols="3"
      >
        <v-btn-toggle v-model="doabs_" color="#00c853" rounded>
          <v-btn x-large>Do abs
            <v-icon>mdi-check-circle-outline</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <v-row>
        <v-btn class="ma-2" tile outlined color="error" v-on:click="cancel">Cancel</v-btn>
        <v-btn class="ma-2" tile outlined color="success" v-on:click="registry">Registry</v-btn>
    </v-row>

    <v-snackbar
      v-model="show_snackbar_success"
      color="success"
      top
      :timeout="snackbar_to"
      > SUCCESS
    </v-snackbar>
    <v-snackbar
      v-model="show_snackbar_error"
      color="success"
      top
      :timeout="snackbar_to"
      > {{ error_str }}
    </v-snackbar>
  </v-container>
</template>

<script src="https://www.gstatic.com/firebasejs/7.2.3/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/7.2.3/firebase-firestore.js"></script>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import db from '../firebaseConf'

@Component
export default class RegistryComp extends Vue {
  private date_: string = "1970-01-01";
  private weight_: number = 80;
  private fat_: number = 25;
  private jumprope_: number = 5;
  private doabs_: number = 0;
  public show_snackbar_success: boolean = false;
  private show_snackbar_error: boolean = false;
  private snackbar_sts: string = "success";
  private snackbar_to: number = 3000;
  public error_str: string = "";

  constructor() {
    super();
  }

  private created() {
    this.date_ = this.getSelectedDate();
  }

  getSelectedDateEpoch(): number {
    let dt = new Date();
    dt.setTime(dt.getTime() + 1000 * 60 * 60 * 9);
    return dt.getTime() / 1000;
  }

  getSelectedDate(): string {
    let dt = new Date();
    dt.setTime(dt.getTime() + 1000 * 60 * 60 * 9);
    return dt.toISOString().substr(0, 10);
  }

  registry(): void {
    let self = this;
    this.error_str= "";

    db.collection('balances').add({
      update_at: this.date_,
      update_at_epoch: this.getSelectedDateEpoch(),
      weight: Number(this.weight_),
      bodyfat: Number(this.fat_),
      jumprope: Number(this.jumprope_),
      doabs: this.doabs_ === 0 ? 1 : 0,
    })
    .then(function(success) {
      self.show_snackbar_success = true;
    })
    .then(function(error) {
      self.show_snackbar_error = true;
      self.error_str = String(error);
    });
  }

  cancel(): void {
    alert("cancel");
  }
}
</script>
