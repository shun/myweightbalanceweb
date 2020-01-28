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
        cols="2"
      >
        <v-text-field label="Weight" v-model="weight_" clearable type="number" suffix="kg"></v-text-field>
      </v-col>
      <v-col
        cols="2"
      >
        <v-text-field label="Body Fat" v-model="fat_" type="number" clearable suffix="%"></v-text-field>
      </v-col>
      <v-col
        cols="2"
      >
        <v-text-field label="Jump rope" v-model="jumprope_" type="number" clearable suffix="min"></v-text-field>
      </v-col>
      <v-col
        cols="1"
      >
        <v-btn-toggle v-model="doabs_" color="#00c853" rounded>
          <v-btn x-large>abs
            <v-icon>mdi-check-circle-outline</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
      <v-col
        cols="1"
      >
        <v-btn-toggle v-model="konami_" color="#00c853" rounded>
          <v-btn x-large>Konami
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
      color="error"
      top
      :timeout="snackbar_to"
      > {{ error_str }}
    </v-snackbar>
  </v-container>
</template>

<script src="https://www.gstatic.com/firebasejs/7.2.3/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/7.2.3/firebase-firestore.js"></script>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import db from '../firebaseConf'

@Component
export default class RegistryComp extends Vue {
  private date_: string = "1970-01-01";
  private weight_: number = -1;
  private fat_: number = -1;
  private jumprope_: number = 0;
  private doabs_: number = 1;
  private konami_: number = 1;
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
    this.update_form();
  }

  private getSelectedDateEpoch(): number {
    let dt = new Date();
    dt.setTime(dt.getTime() + 1000 * 60 * 60 * 9);
    return dt.getTime() / 1000;
  }

  private getSelectedDate(): string {
    let dt = new Date();
    dt.setTime(dt.getTime() + 1000 * 60 * 60 * 9);
    return dt.toISOString().substr(0, 10);
  }

  private update_form(): void {
    let self = this;
    self.weight_ = -1;
    self.fat_ = -1;
    self.jumprope_ = 0;
    self.doabs_ = 1;
    self.konami_ = 1;
    db.collection('balances').where("date_at", "==", this.date_).get().then((query) => {
      console.log(query);
      query.forEach(function(doc) {
        let rec = doc.data();
        self.weight_ = rec['weight'];
        self.fat_ = rec['bodyfat'];
        self.jumprope_ = rec['jumprope'];
        self.doabs_ = rec['doabs'] === 0 ? 1 : 0;
        self.konami_ = rec['konami'] === 0 ? 1 : 0;
      });
    });
  }

  private registry(): void {
    let self = this;
    this.error_str= "";

    db.collection('balances').where("date_at", "==", this.date_).get().then((query) => {
      if(0 === query.size) {
        db.collection('balances').add({
          date_at: self.date_,
          date_at_epoch: self.getSelectedDateEpoch(),
          weight: Number(self.weight_),
          bodyfat: Number(self.fat_),
          jumprope: Number(self.jumprope_),
          doabs: self.doabs_ === 0 ? 1 : 0,
          konami: self.konami_ === 0 ? 1 : 0,
        })
        .then(function(success) {
          self.show_snackbar_success = true;
        })
        .catch(function(error) {
          self.error_str = String(error);
          self.show_snackbar_error = true;
        });

      } else {
        console.log(query.docs[0].id);
        db.collection('balances').doc(query.docs[0].id).set({
          date_at: self.date_,
          date_at_epoch: self.getSelectedDateEpoch(),
          weight: Number(self.weight_),
          bodyfat: Number(self.fat_),
          jumprope: Number(self.jumprope_),
          doabs: self.doabs_ === 0 ? 1 : 0,
          konami: self.konami_ === 0 ? 1 : 0,
        })
        .then(function(success) {
          self.show_snackbar_success = true;
        })
        .catch(function(error) {
          self.error_str = String(error);
          self.show_snackbar_error = true;
        });
      }
    });
  }

  private cancel(): void {
    alert("cancel");
  }

  @Watch('date_')
  private pickerDate(): void {
    this.update_form();
  }
}
</script>
