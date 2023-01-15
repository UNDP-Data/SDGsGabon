<script>
  import { onMount} from 'svelte';
  import { csv, json } from "d3-fetch";
  import { select} from 'd3-selection'; 
  import { descending } from 'd3-array';
  import Bars from './lib/Bars.svelte';
  import MultipleBars from './lib/MultipleBars.svelte';
  import LineChart from './lib/LineChart.svelte';
  import Tooltip from './lib/Tooltip.svelte'
  import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'sveltestrap';
  import MultipleLines from './lib/MultipleLines.svelte';
  import MultipleLinesDouble from './lib/MultipleLinesDouble.svelte';
  import List from './lib/List.svelte';
  //import sdgDataJson from './assets/GabonOddDonneesTest.json';
  //import sdgDataJson from './assets/GabonOddDonnees.json';


let dataLoaded =false;
let isOpen= false;
let d3 = {csv, json, select, descending};
let sdgs, sdgDataJson;
let tooltip, imageCode, activeColor;

const dataUrl = 'https://raw.githubusercontent.com/UNDP-Data/SDGsGabon-data/main/GabonOddDonnees.json';
const sdgsUrl = 'https://raw.githubusercontent.com/UNDP-Data/SDGsGabon-data/main/ODDs.csv';

//const dataUrl = 'https://raw.githubusercontent.com/UNDP-Data/SDGsGabon-dataTest/main/GabonOddDonnees.json'; /// test version!!!
//const sdgsUrl = 'https://raw.githubusercontent.com/UNDP-Data/SDGsGabon-dataTest/main/ODDs.csv'; /// test version!!!

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
  await Promise.all([
    d3.csv(sdgsUrl),
    d3.json(dataUrl)
  ])
  .then( function(result){ 
    sdgs = result[0];
    sdgDataJson = result[1];
    // adding an array of key/values for years data
    for (const key in sdgDataJson){
      sdgDataJson[key].forEach(target => {
          target.indicateurs.forEach(indicator =>{
            indicator.donnees.forEach(data => {
              let values =[]
              for (const [key, value] of Object.entries(data.valeurs)) {
                  if (!isNaN(key)) values.push({'key':Number(key),'value':value })
              }
              data.values = values.filter(d => d.value != "");
            })
          })
      })
    }
  })
  .catch(function(err) {
    alert("Une erreur s'est produite lors du chargement des fichiers, veuillez vérifier la syntaxe du fichier JSON", err)
  });
  dataLoaded =true;
}

function displayLatestValue(indicator) {
  //console.log('d in display latest value',indicator)
  let dataFirst = indicator.donnees[0] 
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
  // sorting values and using first not empty item
    indicator.donnees[0].values.sort((a,b) => d3.descending(a.key, b.key))
    let value = indicator.donnees[0].values.find( d => d.value  !="")
    return value;
}

function displayNumberContainer(indicator){
  //console.log('indicator chart --------',indicator)
  if (indicator.graphique == 'Bandes'){
    //console.log('comparer',indicator.donnees.some(d => d.parametre === 'comparer'))
    return indicator.donnees.some(d => d.parametre === 'comparer');
  }
  else if (indicator.graphique == "GroupeBarres" || indicator.graphique == "GroupeLignes" || indicator.graphique == 'GroupeLignesDouble' || indicator.graphique == 'Liste'){
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
			<Dropdown {isOpen} toggle={() => (isOpen = !isOpen)} size="lg">Sélectionnez ODD
        <DropdownToggle class="undp-select">
					<span class="selectedSDG">{ sdgs.filter(d => d.code == activeSDG)[0].nomCourt }<span>
        </DropdownToggle>
				<DropdownMenu class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
					{#each sdgs as option}
						<DropdownItem on:click={() =>{activeSDG = option.code; }}>
                <div class="dropdownId" style="background: {`${sdgColors['sdg_'+option.code]}`}">
                  {option.code}
                </div>
                <div class="dropdownName" >
                  {option.nomCourt}
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
              <h2>{sdgs.filter( d => (d.code === activeSDG))[0]['nomLong']}</h2>
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
                  <div class="col col-xs-12 col-md-12 col-lg-11 offset-lg-1 test" style="border-left: 2px solid {activeColor};">
                    <div class="row">
                      <div class="col-xs-12 col-md-8 indicator-text" >
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
                      </div>
                      <!--- LATEST YEAR VALUE -->
                      <div class="col-xs-12 col-md-4 number-container justify-content-center">
                        {#if displayNumberContainer(indicator)}
                          <div class="yearValue" style="background-color: {activeColor};">
                            <div class="year">{displayLatestValue(indicator)['key']}</div>
                            <div class="{(displayLatestValue(indicator)['value'].toString().length < 6)?'value':'longValue'}">{displayLatestValue(indicator)['value']}{indicator.donnees[0].unite}</div>
                          </div>
                          {/if}
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-xs-12 col-md-12 col-lg-8">
                            <!---- charts -->
                            {#if indicator.graphique == 'Bandes'}
                            <Bars 
                              data={indicator.donnees.filter(d => d.parametre != 'cacher')}
                              id = {indicator.codeIndicateur}
                              color = {activeColor}
                              latestValue={latestNumber(indicator)}
                            ></Bars>
                          {:else if indicator.graphique == 'GroupeBarres'}
                            <MultipleBars 
                              data={indicator.donnees.filter(d => d.parametre != 'cacher')}
                              id = {indicator.codeIndicateur}
                              color = {activeColor}
                              latestValue={latestNumber(indicator)}
                              subtitles= {indicator.titreGroupe}
                              ></MultipleBars>
                          {:else if indicator.graphique == 'Ligne'}
                            <LineChart
                              data= {indicator['donnees'][0].values}
                              id = {indicator.codeIndicateur}
                              color = {activeColor}
                              unit = {indicator['donnees'][0].unite}
                            >
                            </LineChart>
                          {:else if indicator.graphique == 'GroupeLignes'}
                            <MultipleLines
                              data= {indicator.donnees.filter(d => d.parametre != 'cacher')}
                              id = {indicator.codeIndicateur}
                              color = {activeColor}
                            >
                            </MultipleLines>
                          {:else if indicator.graphique == 'GroupeLignesDouble'}
                            <MultipleLinesDouble
                              data= {indicator['donnees'].filter(d => d.parametre != 'cacher')}
                              id = {indicator.codeIndicateur}
                            >
                          </MultipleLinesDouble>
                          {:else if indicator.graphique == 'Liste'}
                            <List 
                            data={indicator.donnees.filter(d => d.parametre != 'cacher')}
                            id = {indicator.codeIndicateur}
                            color ={activeColor}
                            ></List>
                          {/if}
                      </div>
                    </div>
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
