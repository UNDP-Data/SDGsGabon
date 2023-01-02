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
function displayLatestValue(d) {
  let indicatorValues = sdgsData.filter( k => (k.indicator === d.indicateurId) && (k.unit != 'title'));
  //console.log(indicatorValues, indicatorValues.length)
  if (indicatorValues.length === 0) return {key:'-',value:'no value yet'};
  else {
      let latestValue = latestNumber(indicatorValues[0])
      if (latestValue != undefined) return latestValue;
      else return {key:'-',value:'-'};
  }
}
function latestNumber(items){
  // console.log('in latest Number',items)
  // sorting values
  // considering first item which should be a general number (for whole country)
  // console.log('items',items.values)
    items.values.sort((a,b) => d3.descending(a.key, b.key))
    let value = items.values.find( d => d.value  !="")
    return value;
}
function displayUnit(indicator){
  let unit ='';
  try {
    unit = sdgsData.filter( k => (k.indicator === indicator) && (k.unit != 'title') && (k.unit != 'subtitle'))[0].unit;
  } catch(error){
    console.log('unit not found', indicator, error)
  }
  unit = (unit!='%')?` ${unit}`:unit;
  return unit;
}
function displaySource(indicator){
  let source ='';
  try{
    source = sources.filter( d => d.indicator == indicator)[0].source;
  } catch(error){
    console.log('source not found',indicator, error)
  }
  return source;
}
function displayNumberContainer(indicator){
  //console.log('indicator chart --------',indicator.chart)
  if (indicator.chart == 'bar'){
    let indicatorData = sdgsData.filter( k => (k.indicator === indicator.indicateurId))
    return indicatorData.some(d => d.indicatorSetting === 'compare');
  }
  else if (indicator.chart == "barGroup" || indicator.chart == "lineGroup"){
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
              <!---- LOOPING THROUGH TARGETS --->
              {#each allTargets.filter(d => d.split('.')[0] == activeSDG) as target}
              <!---- TARGET TITLE -->
              <div class="row indicatorsByTarget">
                <div class="col target" style="border-top: medium none;">
                  <h3>Cible {target}</h3>{selectedSdgText.filter( d => d.Cible.split(' ')[0]== target)[0].Cible.split(/ (.*)/s)[1]}
                </div>
              </div>
              <!---- LOOPING THROUGH INDICATORS --->
              {#each selectedSdgText.filter( d => d.Cible.split(' ')[0]== target) as indicator}
              <div class="row datadiv">
                <div class="col-xs-12 col-md-8 col-lg-7 offset-lg-1 indicator-text" style="border-left: 2px solid {activeColor};">
                  {sdgsData.filter( k => (k.indicator === indicator.indicateurId))[0].description}
                  <Tooltip
                    content = {displaySource(indicator.indicateurId)}
                    div = {'tooltipDiv'}
                    displayTooltip= {true}
                    >
                  <span class="source" style="border-bottom: 2px solid {activeColor};"><br>(Source)</span>
                  </Tooltip>
                  {#if indicator.chart == 'barGroup'}
                    <MultipleBars 
                      data={sdgsData.filter( k => (k.indicator === indicator.indicateurId) && (k.unit != 'title') && (k.indicatorSetting!='hide'))}
                      id = {indicator.indicateurId}
                      color = {activeColor}
                      unit ={displayUnit(indicator.indicateurId)}
                      latestValue={latestNumber(sdgsData.filter( k => (k.indicator === indicator.indicateurId) && (k.unit != 'title') && (k.unit != 'subtitle'))[0])}
                      ></MultipleBars>
                  {/if}
                  {#if indicator.chart == 'bar'}
                    <Bars 
                      data={sdgsData.filter( k => (k.indicator === indicator.indicateurId) && (k.unit != 'title') && (k.indicatorSetting!='hide'))}
                      id = {indicator.indicateurId}
                      color = {activeColor}
                      unit ={displayUnit(indicator.indicateurId)}
                      latestValue={latestNumber(sdgsData.filter( k => (k.indicator === indicator.indicateurId) && (k.unit != 'title'))[0])}
                      ></Bars>
                  {/if}
                  {#if indicator.chart == 'lineGroup'}
                  <MultipleLines
                    data= {sdgsData.filter( k => (k.indicator === indicator.indicateurId) && (k.unit != 'title'))}
                    id = {indicator.indicateurId}
                    color = {activeColor}
                    unit = {displayUnit(indicator.indicateurId)}
                  >
                </MultipleLines>
                {/if}
                  {#if indicator.chart == 'line'}
                    <LineChart
                      data= {sdgsData.filter( k => (k.indicator === indicator.indicateurId) && (k.unit != 'title'))[0].values}
                      id = {indicator.indicateurId}
                      color = {activeColor}
                      unit = {displayUnit(indicator.indicateurId)}
                    >
                    </LineChart>
                  {/if}
                </div>
                <!--- LATEST YEAR VALUE -->
                <div class="col-xs-12 col-md-4 col-lg-4 number-container">
                  {#if displayNumberContainer(indicator)}
                    <div class="yearValue" style="background-color: {activeColor};">
                      <div class="year">{displayLatestValue(indicator)['key']}</div>
                      <div class="value">{displayLatestValue(indicator)['value']}{displayUnit(indicator.indicateurId)}</div>
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
<!--div class="tooltipDiv arrow_box" >
</div-->
<style>

</style>
