<script>
  import { onMount} from 'svelte';
  import { csv } from "d3-fetch";
  import { select, selectAll} from 'd3-selection'; 
  import { max, sum,descending } from 'd3-array';
  import Bars from './lib/Bars.svelte';
  import MultipleBars from './lib/MultipleBars.svelte';
  import LineChart from './lib/LineChart.svelte';
  import Tooltip from './lib/Tooltip.svelte'
  import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'sveltestrap';
  import MultipleLines from './lib/MultipleLines.svelte';
  import MultipleLinesDouble from './lib/MultipleLinesDouble.svelte';
  import List from './lib/List.svelte';
  import sdgDataJson from './assets/GabonOddDonees.json';

let dataLoaded =false;
let first = true;
let isOpen= false;
let d3 = { csv, select, selectAll,max, sum,descending};
let sdgsText = [],sdgsData,sdgs,allTargets, selectedSdgText, sources;
let tooltip, imageCode, activeColor;

const sdgColors = { 'sdg_1': '#e5243b', 'sdg_2': '#dda63a','sdg_3': '#4c9f38','sdg_4':'#c5192d','sdg_5' : ' #ff3a21','sdg_6' : ' #26bde2','sdg_7' : '#fcc30b','sdg_8' : '#a21942','sdg_9' : '#fd6925','sdg_10' : '#dd1367','sdg_11' : '#fd9d24','sdg_12' : '#bf8b2e','sdg_13' : '#3f7e44','sdg_14' : '#0a97d9','sdg_15' : '#56c02b','sdg_16' : '#00689d','sdg_17' : '#19486a'}

let activeSDG = '1';
$: {
  imageCode = (Number(activeSDG) < 10)?'0'+activeSDG:activeSDG;
  activeColor = sdgColors[`sdg_${activeSDG}`];
}

for (const key in sdgDataJson){
  sdgDataJson[key].forEach(target => {
      target.indicateurs.forEach(indicator =>{
        indicator.donees.forEach(data => {
          //console.log('data',data)
          let values =[]
          for (const [key, value] of Object.entries(data.valeurs)) {
              if (!isNaN(key)) values.push({'key':Number(key),'value':value })
          }
          data.values = values;
          //console.log('values',values)
        })
      })
  })
}

onMount(()=> {
  tooltip = d3.select('.tooltipDiv');
  


  getData();
});
const getData = async() => {
  /*if (first) {
    ////-- do something only the first time
    first=false;
  }*/
  await Promise.all([
    d3.csv("data/ODDlist.csv"),
    d3.csv("data/SDGdata_cleaned.csv"),
    d3.csv("data/sdgShortNames.csv"),
    d3.csv('data/sources.csv')
  ]).then( function(result){ 
    sdgsText = result[0].filter(d =>  d["Indicateur disponible"] === "Oui"); // only those with available indicator
    sdgsData = result[1];
    sdgsData.forEach(d =>{
        // identifying keys which are numbers and creating a 'values' array with them
        // to be able to use them in the charts
        let values =[];
        for (const [key, value] of Object.entries(d)) {
            if (!isNaN(key)) values.push({'key':Number(key),'value':value.replace(',','.')})
        }
        d.values = values;
    })
    sdgs = result[2];
    allTargets = [... new Set(sdgsText.map(d =>  d.Cible.split(' ')[0] ))]
    sources = result[3];
  })
  dataLoaded =true;
}
// filtering data for selected SDG
$: if (sdgsText.length > 0) {
  selectedSdgText = sdgsText.filter( d => (d.code === activeSDG))
};

/// ---

function displayLatestValue(indicator) {
  //console.log('d in display latest value',indicator)
  let dataFirst = indicator.donees[0] 
  let yearsData = dataFirst.valeurs; /// using first value
  let values = []
  for (const [key, value] of Object.entries(yearsData)) {
            if (!isNaN(key)) values.push({'key':Number(key),'value':value })
        }
  if (values.length === 0) return {key:'-',value:'no value yet'};
  else {
    values.sort((a,b) => d3.descending(a.key, b.key))
    let value = values.find( d => d.value  !="")
    if (value != undefined) return value;
    else return {key:'-',value:'-'};
  }
}
function latestNumber(indicator){
   //console.log('in latest Number',indicator)
  // sorting values
  // considering first item which should be a general number (for whole country)
    indicator.donees[0].values.sort((a,b) => d3.descending(a.key, b.key))
    let value = indicator.donees[0].values.find( d => d.value  !="")
    return value;
}
function displayUnit(indicator){
  let unit ='';
  try {
    unit = sdgsData.filter( k => (k.indicator === indicator) && (k.unit != 'title') && (k.unit != 'subtitle'))[0].unit;
  } catch(error){
    //console.log('unit not found', indicator, error)
  }
  unit = (unit!='%')?` ${unit}`:unit;
  return unit;
}

function displayNumberContainer(indicator){
  //console.log('indicator chart --------',indicator.groupe)
  if (indicator.groupe == 'bar'){
    let indicatorData = sdgsData.filter( k => (k.indicator === indicator.indicateurId))
    return indicatorData.some(d => d.indicatorSetting === 'compare');
  }
  else if (indicator.graphique == "barGroup" || indicator.graphique == "lineGroup" || indicator.graphique == 'lineGroupDouble' || indicator.graphique == 'list'){
    return false;
  }
  else return true;
}

</script>
{#if dataLoaded}
<main>
	<div class="container">
		<header>
			<h1 class="main-title">Objectifs de Développement Durable au Gabon</h1>
			<div class="alert alert-warning" role="alert">
				Essai 2, travaux en cours ! | Test 2, work in progress!
			</div>
			<Dropdown {isOpen} toggle={() => (isOpen = !isOpen)} size="lg">Sélectionnez ODD
        <DropdownToggle class="undp-select">
					<span class="selectedSDG">{ sdgs.filter(d => d.id == activeSDG)[0].name }<span>
        </DropdownToggle>
				<DropdownMenu class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
					{#each sdgs as option}
						<DropdownItem on:click={() =>{activeSDG = option.id; }}>
                <div class="dropdownId" style="background: {`${sdgColors['sdg_'+option.id]}`}">
                  {option.id}
                </div>
                <div class="dropdownName" >
                  {option.name}
                </div>
            </DropdownItem>
					{/each}
          </DropdownMenu>
			</Dropdown>
		</header>
		<div id="sdg-list">
      <div class="row sdg{activeSDG} sdg">
        <div class="col">
          <!-----  SDG TITLE  -->
          <div class="row sdg-title g-0" style="border-bottom: 2px solid {activeColor};">
            <div class="col titleContainer">
              <img class="sdgIcon" src="assets/images/F-WEB-Goal-{imageCode}.png" alt="icon">
              <h2>{selectedSdgText[0]['ODD'].split(': ')[1]}</h2>
            </div>
          </div>
          <div class="row">
            <div class="col sdgcontainer">
              <!---- LOOPING THROUGH TARGETS (Cible = target) --->
              {#each sdgDataJson[activeSDG] as target}
              <!---- TARGET TITLE -->
              {#if (target.indicateurs.filter(d => d.indicateurDisponible == 'Oui').length > 0) } 
              <div class="row indicatorsByTarget">
                <div class="col target" style="border-top: medium none;">
                  <h3>Cible {target.codeCible}</h3>{target.cible}
                </div>
              </div>
              {/if}
              <!---- LOOPING THROUGH INDICATORS --->
              {#each target.indicateurs.filter(d => d.indicateurDisponible ==  'Oui') as indicator}
              <div class="row datadiv">
                <div class="col-xs-12 col-md-8 col-lg-7 offset-lg-1 indicator-text" style="border-left: 2px solid {activeColor};">
                  <!--- indicator title -->
                  {indicator.indicateur}
                  <!--- source with tooltip -->
                  <Tooltip
                    content = {indicator.source}
                    div = {'tooltipDiv'}
                    displayTooltip= {true}
                    svg ={false}
                    >
                  <span class="source" style="border-bottom: 2px solid {activeColor};"><br>(Source)</span>
                  </Tooltip>
                  <!---- charts -->
                  {#if indicator.graphique == 'barGroup'}
                    <MultipleBars 
                      data={indicator.donees.filter(d => d.parametre != 'hide')}
                      id = {indicator.codeIndicateur}
                      color = {activeColor}
                      latestValue={latestNumber(indicator)}
                      subtitles= {indicator.titreGroupe}
                      ></MultipleBars>
                  {:else if indicator.graphique == 'bar'}
                    <Bars 
                      data={indicator.donees.filter(d => d.parametre != 'hide')}
                      id = {indicator.codeIndicateur}
                      color = {activeColor}
                      latestValue={latestNumber(indicator)}
                      ></Bars>
                  {:else if indicator.graphique == 'lineGroup'}
                    <MultipleLines
                      data= {indicator.donees.filter(d => d.parametre != 'hide')}
                      id = {indicator.indicateurId}
                      color = {activeColor}
                      unit = {indicator['donees'][0].unite}
                    >
                    </MultipleLines>
                  {:else if indicator.graphique == 'line'}
                    <LineChart
                      data= {indicator['donees'][0].values}
                      id = {indicator.codeIndicateur}
                      color = {activeColor}
                      unit = {indicator['donees'][0].unite}
                    >
                    </LineChart>
                  {:else if indicator.graphique == 'lineGroupDouble'}
                    <MultipleLinesDouble
                      data= {indicator['donees'].filter(d => d.parametre != 'hide')}
                      id = {indicator.codeIndicateur}
                      color = {activeColor}
                    >
                  </MultipleLinesDouble>
                  {:else if indicator.graphique == 'list'}
                    <List 
                    data={indicator.donees.filter(d => d.parametre != 'hide')}
                    id = {indicator.codeIndicateur}
                    color = {activeColor}
                    ></List>
                  {/if}
                </div>
                <!--- LATEST YEAR VALUE -->
                <div class="col-xs-12 col-md-4 col-lg-4 number-container">
                  {#if displayNumberContainer(indicator)}
                    <div class="yearValue" style="background-color: {activeColor};">
                      <div class="year">{displayLatestValue(indicator)['key']}</div>
                      <div class="{(displayLatestValue(indicator)['value'].toString().length < 6)?'value':'longValue'}">{displayLatestValue(indicator)['value']}{indicator.donees[0].unite}</div>
                    </div>
                    {/if}
                  </div>
                </div>
              {/each}
            {/each}
            </div>
          </div>
        </div>
		</div>
		<div class="tooltipDiv arrow_box_bottom"></div>
	</div>
</main>
{/if}
<style>

</style>
