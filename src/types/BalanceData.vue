<script lang="ts">

export default class BalanceData {
  public weight: number;
  public bodyfat: number;
  public jumprope: number;
  public doabs: boolean;
  public update_at: string;
  public update_at_epoch: string;

  constructor() {
    this.weight = -1;
    this.bodyfat = -1;
    this.jumprope = -1;
    this.doabs = false;
    this.update_at = "";
    this.update_at_epoch = "";
  }
}
</script>
