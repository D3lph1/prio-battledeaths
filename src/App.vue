<script setup>
import { ModalsContainer } from 'vue-final-modal'
import Modal from "@/Modal.vue";

const typeOfConflictModal = ref(false)
const intensityLevelModal = ref(false)
const cumulativeIntensityModal = ref(false)
const deathsLowModal = ref(false)
const deathsHighModal = ref(false)
const deathsBestModal = ref(false)
const recordingModal = ref(false)

import * as d3 from 'd3'
import {computed, onMounted, reactive, ref} from "vue";
import {flag} from "@/flag";
import './seedrandom.min'
import {countryNameOnGlobe} from "@/map";

let globeRerender

const SPIN_WIDTH = 12
const spinOffset = (window.innerWidth / 2 - SPIN_WIDTH) + 'px'

const sideAReact = reactive([])
const sideA2ndReact = reactive([])

const sideBReact = reactive([])
const sideB2ndReact = reactive([])

const currentBattle = ref(null)
let lat = null
let lng = null
let radius = null

let sideAParticipants = []
let sideA2ndParticipants = []

let sideBParticipants = []
let sideB2ndParticipants = []

const recording = ref(false)
let uniqueRecords = {}
const records = ref({})
const recordedMarkers = ref({})

const type = computed(() => {
    if (currentBattle.value === null) {
        return ''
    }

    switch (currentBattle.value.payload.type) {
        case 1:
            return 'Extrasystemic'
        case 2:
            return 'Interstate'
        case 3:
            return 'Internal'
        case 4:
            return 'Internationalized internal'
        default:
            return ''
    }
})

const intensityLevel = computed(() => {
    if (currentBattle.value === null) {
        return ''
    }

    switch (currentBattle.value.payload.int) {
        case 1:
            return 'Minor armed conflict'
        case 2:
            return 'War'
        default:
            return ''
    }
})

const cumulativeIntensity = computed(() => {
    if (currentBattle.value === null) {
        return ''
    }

    switch (currentBattle.value.payload.cumint) {
        case 0:
            return '< 1000 battle-related deaths'
        case 1:
            return '> 1000 battle-related deaths'
        default:
            return ''
    }
})

function binarySearch(arr, val, threshold) {
    let start = 0;
    let end = arr.length - 1;

    while (start <= end) {
        let mid = Math.floor((start + end) / 2);

        let diff = arr[mid].from - val
        if (diff <= 0 && Math.abs(diff) < threshold) {
            return mid;
        }

        if (val < arr[mid].from) {
            end = mid - 1;
        } else {
            start = mid + 1;
        }
    }

    return -1;
}

onMounted(() => {
    d3.json(import.meta.env.BASE_URL + '/data.json')
        .then(data => {
            const [minYear, maxYear] = (() => {
                const keys = Object.keys(data).map(x => Number(x))

                return [Math.min.apply(Math, keys), Math.max.apply(Math, keys)]
            }) ()

            const [epochs, decadesLabelsData, yearsLabelsData, battlesData, battleStep] = (() => {
                let decades = {}
                let partsSum = 0;

                for (const k in data) {
                    let decade = Math.floor(k / 10)
                    if (decades[decade] === undefined) {
                        decades[decade] = {
                            years: {},
                            sum: 0
                        }
                    }

                    decades[decade].years[k] = data[k]
                    decades[decade].sum += data[k].length
                    partsSum += data[k].length
                }

                const step = 20000 / partsSum
                let curr = 0

                let epochs = []
                let battlesData = []
                let battleStepRet = null
                let yearsLabelsData = []
                let decadesLabelsData = []
                let j = 0
                let id = 0

                for (const k in decades) {
                    const duration = step * decades[k].sum

                    epochs.push({
                        from: curr,
                        duration
                    })

                    /// Years

                    const years = decades[k].years
                    let yearsSum = 0
                    for (const year in years) {
                        yearsSum += years[year].length
                    }

                    let yearCurr = 0
                    const yearStep = duration / yearsSum
                    let i = 0
                    for (const year in years) {
                        if (i !== 0) {
                            const lastDigit = year % 10

                            yearsLabelsData.push({
                                time: curr + yearCurr,
                                text: String(year),
                                priority: [3, 7].includes(lastDigit) ? 0 : ([1, 5, 9].includes(lastDigit) ? 1 : 2)
                            })
                        }

                        /// Battles

                        const increment = yearStep * years[year].length
                        const battleStep = yearStep
                        battleStepRet = battleStep
                        let l = 0

                        for (const battle in years[year]) {
                            battlesData.push({
                                from: curr + yearCurr + battleStep * l,
                                width: battleStep,
                                index: l,
                                id,
                                payload: years[year][battle]
                            })

                            l++
                            id++
                        }

                        ///

                        yearCurr += increment
                        i++
                    }

                    ///


                    /// Decades

                    decadesLabelsData.push({
                        time: curr,
                        text: j === 0 ? String(minYear) : String(k) + '0'
                    })

                    ///

                    curr += step * decades[k].sum
                    j++
                }

                decadesLabelsData.push({
                    time: curr,
                    text: String(maxYear)
                })

                return [epochs, decadesLabelsData, yearsLabelsData, battlesData, battleStepRet]
            })()

            const width = 1000;
            const height = 200;

            const extent = [[0, 0], [width, 0]];

            const scaleExtent = [width / 20000, 2]
            const translateExtent = [[0, 0], [20000, 0]];


            const globalScale = 500 / 20000

            const svg = d3
                .create('svg')
                .attr('id', 'timeline')
                .attr('viewBox', [0, 0, width, height])

            const g = svg.append('g')
                .attr('cursor', 'grab')

            g.selectAll('rect')
                .data(epochs)
                .join('rect')
                .attr('x', ({from}) => from)
                .attr('y', height / 4)
                .attr('width', ({duration}) => duration)
                .attr('height', height / 2)
                .attr('fill', (d, i) => d3.interpolateRainbow(i / decadesLabelsData.length))
                .on('click', (event) => {
                    console.log('Clicked', event)
                })


            const groupBattles = svg.append('g')
                .attr('class', 'battles')
                .attr('cursor', 'grab')

            const battles = groupBattles.selectAll('battles')
                .data(battlesData)
                .join('rect')
                .attr('class', 'battle')
                .attr('x', ({from}) => from)
                .attr('y', height / 4)
                .attr('width', ({width}) => width)
                .attr('height', height / 2)
                .attr('fill', ({index}) => index % 2 === 0 ? 'yellow' : 'black')
                .attr('fill-opacity', '0.5')
                .attr('display', 'none')
                .attr('data-index', ({index}) => index)

            const groupEventLabels = svg.append('g')
                .attr('class', 'year-labels')
                .attr('cursor', 'grab')

            const eventLabels = groupEventLabels.selectAll('year-labels')
                .data(yearsLabelsData)
                .join('g')
                .attr('transform', ({time}) => 'translate(' + time * globalScale + ' ' + height / 2 + ')')
                .attr('class', ({priority}) => `year-label-${priority}`)
                .attr('opacity', '0')

            eventLabels.append('circle')
                .attr('cx', 0)
                .attr('cy', 20)
                .attr('r', 1.5)
                .attr('transform-origin', '50% 50%')
                .attr('fill', 'black')
            eventLabels.append('text')
                .attr('x', 10)
                .attr('y', 20)
                .attr('text-anchor', 'start')
                .attr('alignment-baseline', 'middle')
                .text(d => d.text)
                .attr('font-family', 'Verdana, sans-serif')
                .attr("font-size", '14px')
                .attr("fill", 'black')
            eventLabels.append('rect')
                .attr('x', -0.5)
                .attr('y', 0)
                .attr('width', 1)
                .attr('height', height * 0.7)
                .attr('stroke', 'black')
                .attr('stroke-width', 0)
                .attr('fill', 'black')


            const groupTimeLabels = svg.append('g')
                .attr('class', 'decade-labels')
                .attr('cursor', 'grab')

            const timeLabels = groupTimeLabels.selectAll('decade-labels')
                .data(decadesLabelsData)
                .join('g')
                .attr('transform', ({time}) => 'translate(' + time * globalScale + ' ' + height / 2 + ')')
            timeLabels.append('circle')
                .attr('cx', 0)
                .attr('cy', height - 20)
                .attr('r', 1.5)
                .attr('transform-origin', '50% 50%')
                .attr('fill', 'black')
            timeLabels.append('text')
                .attr('x', 10)
                .attr('y', height - 45)
                .attr('text-anchor', 'start')
                .attr('alignment-baseline', 'middle')
                .text(d => d.text)
                .attr('font-family', 'Verdana, sans-serif')
                .attr("font-size", '14px')
                .attr("fill", 'black')
                .attr('writing-mode', 'vertical-rl')
            timeLabels.append('rect')
                .attr('x', -0.5)
                .attr('y', height * 0.2)
                .attr('width', 1)
                .attr('height', height * 0.8)
                .attr('stroke', 'black')
                .attr('stroke-width', 0)
                .attr('fill', 'black')

            let lastX = 0
            let lastK = 0.05

            const zoom = d3.zoom()
                .extent(extent)
                .scaleExtent(scaleExtent)
                .translateExtent(translateExtent)
                .on('zoom', (e) => {
                    const {k, x, y} = e.transform

                    lastX = x
                    lastK = k

                    g.attr('transform', 'translate(' + x + ' 0) scale(' + (k) + ' 1)')
                    battles.attr('transform', 'translate(' + x + ' 0) scale(' + (k) + ' 1)')
                    eventLabels.attr('transform', ({time}) => 'translate(' + (x + time * k) + ' ' + 10 + ')')
                    timeLabels.attr('transform', ({time}) => 'translate(' + (x + time * k) + ' ' + 10 + ')')

                    if (k > 0.08) {
                        groupEventLabels.selectAll('.year-label-0').style('opacity', '1')
                    } else {
                        groupEventLabels.selectAll('.year-label-0').style('opacity', '0')
                    }

                    if (k > 0.15) {
                        groupEventLabels.selectAll('.year-label-1').style('opacity', '1')
                    } else {
                        groupEventLabels.selectAll('.year-label-1').style('opacity', '0')
                    }

                    if (k > 0.3) {
                        groupEventLabels.selectAll('.year-label-2').style('opacity', '1')
                    } else {
                        groupEventLabels.selectAll('.year-label-2').style('opacity', '0')
                    }

                    if (k > 0.7) {
                        battles.attr('display', 'block')
                    } else {
                        battles.attr('display', 'none')
                    }

                    // if (zoom1) {
                    //     if (e.sourceEvent === null) {
                    //         return
                    //     }
                    //
                    //     // d3.select('#spin').call(zoom1.transform, d3.zoomIdentity.scale(k).translate(x, 0))
                    // }

                    rerender(x, k)
                })

            svg.call(zoom)
            svg.call(zoom.scaleBy, globalScale)

            svg.attr('style', 'width: 1000px; height: 200px')

            // var zoom1 = d3.zoom()
            //     .extent(extent)
            //     .scaleExtent(scaleExtent)
            //     .translateExtent(translateExtent)
            //     .on('zoom', (e) => {
            //         if (e.sourceEvent === null) {
            //             return
            //         }
            //
            //         const z = d3.zoomTransform(svg.node())
            //         let {k, x, y} = e.transform
            //
            //         // const s = [11119.059785385793, 10.219724067450178];
            //         const s = [12498.722534491568, 12508.9422586];
            //         // const s = [556, 558];
            //
            //
            //         const center = [500, 0];
            //         x = (x - center[0]) * k + center[0];
            //
            //         svg.call(
            //             zoom.transform,
            //             d3.zoomIdentity.translate(x, 0).scale(k)
            //         )
            //
            //         // rerender(x, k)
            //     })

            // d3.select('#spin').call(zoom1)
            // d3.select('#spin').call(zoom1.scaleBy, globalScale)


            d3.select('#timeline-container')
                .append(() => svg.node());

            // const z = d3.zoomTransform(svg.node())
            setTimeout(() => rerender(lastX, lastK), 100)

            function filter(e) {
                if (!e.target.classList.contains('handle')) {
                    return
                }

                let target = document.getElementById('spin')

                target.moving = true;

                if (e.clientX) {
                    target.oldX = e.clientX;
                } else {
                    target.oldX = e.touches[0].clientX;
                }

                target.oldLeft = window.getComputedStyle(target).getPropertyValue('left').split('px')[0] * 1;
                target.oldTop = window.getComputedStyle(target).getPropertyValue('top').split('px')[0] * 1;

                document.onmousemove = dr;
                document.ontouchmove = dr;

                const timeline = document.getElementById('timeline')
                const timelineRec = timeline.getBoundingClientRect()
                const extremeLeft = timelineRec.x
                const extremeRight = extremeLeft + timelineRec.width

                function dr(event) {
                    event.preventDefault();

                    if (!target.moving) {
                        return;
                    }

                    if (event.clientX) {
                        if (event.clientX < extremeLeft + 10 || event.clientX > extremeRight - 10) {
                            return
                        }

                        target.distX = event.clientX - target.oldX;
                        target.distY = event.clientY - target.oldY;
                    } else {
                        target.distX = event.touches[0].clientX - target.oldX;
                        target.distY = event.touches[0].clientY - target.oldY;
                    }

                    target.style.left = target.oldLeft + target.distX + "px";
                    target.style.top = target.oldTop + target.distY + "px";

                    rerender(lastX, lastK)
                }

                function endDrag() {
                    target.moving = false;
                }

                target.onmouseup = endDrag;
                target.ontouchend = endDrag;
            }

            document.onmousedown = filter;
            document.ontouchstart = filter;

            function rerender(x, k) {
                const spin = document.getElementById('spin-line')

                const timeline = document.getElementById('timeline')
                if (timeline === null) {
                    return
                }

                const timelineX = timeline.getBoundingClientRect().x

                const spinRelX = spin.getBoundingClientRect().x - timelineX

                const left = Math.abs(x / k)
                const v = 1 / k
                const val = left + v * spinRelX

                let idx = binarySearch(battlesData, val, battleStep)
                let battle = battlesData[idx]

                render(battle)
            }

            function render(battle) {
                currentBattle.value = battle

                sideAReact.splice(0)
                sideA2ndReact.splice(0)
                sideBReact.splice(0)
                sideB2ndReact.splice(0)

                for (const sidea of battle.payload.sidea) {
                    sideAReact.push([sidea, flag(sidea)])

                    if (recording.value) addRecord(battle.id, sidea)
                }

                sideAParticipants = battle.payload.sidea

                for (const sidea2nd of battle.payload.sidea2nd) {
                    sideA2ndReact.push([sidea2nd, flag(sidea2nd)])

                    if (recording.value) addRecord(battle.id, sidea2nd)
                }

                sideA2ndParticipants = battle.payload.sidea2nd

                for (const sideb of battle.payload.sideb) {
                    sideBReact.push([sideb, flag(sideb)])

                    if (recording.value) addRecord(battle.id, sideb)
                }

                sideBParticipants = battle.payload.sideb

                for (const sideb2nd of battle.payload.sideb2nd) {
                    sideB2ndReact.push([sideb2nd, flag(sideb2nd)])

                    if (recording.value) addRecord(battle.id, sideb2nd)
                }

                sideB2ndParticipants = battle.payload.sideb2nd

                if (battle.payload.coords == null) {
                    lat = null
                    lng = null
                } else {
                    lat = battle.payload.coords.lat
                    lng = battle.payload.coords.lng

                    if (recording.value) {
                        addMarkerRecord(lat, lng, battle.payload.radius)
                    }
                }

                radius = battle.payload.radius

                Math.seedrandom(String(battle.index))

                projection.scale(SCALE_INIT)
                globeZoom()

                globeRotate()
                globeRerender()
            }
        })

    const SCALE_INIT = 150
    let scale = 150

    let globeSvg
    let globe
    let path
    let projection
    let map


    function globeRotate() {
        if (lat === null) {
            return
        }

        function random(min, max) {
            return Math.random() * (max - min) + min;
        }

        projection.rotate([
            lng * -1 * random(0.7, 1.3),
            lat * -1 * random(0.7, 1.3)
        ])
        path = d3.geoPath().projection(projection)
        globeSvg.selectAll("path").attr("d", path)
    }

    globeRerender = function() {
        function getVisibility() {
            const visible = path(
                {type: 'Point', coordinates: [lng, lat]});

            return visible ? 'visible' : 'hidden';
        }

        function getVisibilityCoord(lat, lng) {
            const visible = path(
                {type: 'Point', coordinates: [lng, lat]});

            return visible ? 'visible' : 'hidden';
        }

        map.selectAll('circle.recorded-marker').remove()

        map.selectAll('path')
            .attr('fill', 'white')

        for (const record in records.value) {
            map.select(`#country_${countryNameOnGlobe(record)}`)
                .attr('fill', getPaletteColorForRecord(records.value[record]))
        }

        for (const marker in recordedMarkers.value) {
            const [lat, lng] = marker.split(',')

            map.append('circle')
                .attr('cx', projection([lng, lat])[0])
                .attr('cy', projection([lng, lat])[1])
                .attr('r', 1 / (recordedMarkers.value[marker] / scale))
                .attr('fill', '#3498db')
                .attr('class', 'recorded-marker')
                .attr('stroke', 'black')
                .attr('strokeWidth', '1')
                .attr('visibility', () => getVisibilityCoord(lat, lng))
        }

        for (const participant of sideAParticipants) {
            map.select(`#country_${countryNameOnGlobe(participant)}`)
                .attr('fill', 'green')
        }

        for (const participant of sideA2ndParticipants) {
            map.select(`#country_${countryNameOnGlobe(participant)}`)
                .attr('fill', 'lightgreen')
        }

        for (const participant of sideBParticipants) {
            map.select(`#country_${countryNameOnGlobe(participant)}`)
                .attr('fill', 'cyan')
        }

        for (const participant of sideB2ndParticipants) {
            map.select(`#country_${countryNameOnGlobe(participant)}`)
                .attr('fill', 'lightcyan')
        }

        if (lat === null) {
            map.select('#marker')
                .attr('cx', 0)
                .attr('cy', 0)
                .attr('visibility', 'hidden');

            map.select('#marker-radius')
                .attr('cx', 0)
                .attr('cy', 0)
                .attr('visibility', 'hidden');

            return
        }

        map.select('#marker')
            .attr('cx', projection([lng, lat])[0])
            .attr('cy', projection([lng, lat])[1])
            .attr('r', 3)
            .attr('fill', 'red')
            .attr('visibility', getVisibility)

        map.select('#marker-radius')
            .attr('cx', projection([lng, lat])[0])
            .attr('cy', projection([lng, lat])[1])
            .attr('r', 1 / (radius / scale))
            .attr('fill', 'red')
            .attr('fill-opacity', '0.2')
            .attr('visibility', 'visible')
    }

    function globeZoom() {
        path = d3.geoPath().projection(projection)
        globeSvg.selectAll("path").attr("d", path)
        globe.attr("r", projection.scale())
        scale = projection.scale()
    }

    function addRecord(id, country) {
        if (id in uniqueRecords) {
            return
        }

        uniqueRecords[id] = 1

        if (!(country in records.value)) {
            records.value[country] = 0
        }

        records.value[country]++
    }

    function addMarkerRecord(lat, lng, radius) {
        const key = `${lat},${lng}`

        if (!(key in recordedMarkers.value)) {
            recordedMarkers.value[key] = radius
        }
    }

    d3.json(import.meta.env.BASE_URL + '/world.json')
        .then(data => {
            let width = 300
            let height = 300
            const sensitivity = 75

            projection = d3.geoOrthographic()
                .scale(SCALE_INIT)
                .center([0, 0])
                .rotate([0, -30])
                .translate([width / 2, height / 2])

            path = d3.geoPath().projection(projection)

            globeSvg = d3.select("#map")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .style('border-radius', '50%')

            globe = globeSvg.append("circle")
                .attr("fill", "#EEE")
                .attr("stroke", "#000")
                .attr("stroke-width", "0.2")
                .attr("cx", width/2)
                .attr("cy", height/2)
                .attr("r", SCALE_INIT)

            globeSvg.call(d3.drag().on('drag', (e) => {
                const rotate = projection.rotate()
                const k = sensitivity / projection.scale()
                projection.rotate([
                    rotate[0] + e.dx * k,
                    rotate[1] - e.dy * k
                ])
                path = d3.geoPath().projection(projection)
                globeSvg.selectAll("path").attr("d", path)

                globeRerender()
            }))
                .call(d3.zoom().on('zoom', e => {
                    if (e.transform.k > 0.8) {
                        projection.scale(SCALE_INIT * e.transform.k)

                        globeZoom()
                        globeRerender()
                    } else {
                        e.transform.k = 0.8
                    }
                }))

            map = globeSvg.append("g")

            map.append("g")
                .attr("class", "countries" )
                .selectAll("path")
                .data(data.features)
                .enter().append("path")
                .attr("id", d => 'country_' + d.properties.name.replaceAll(' ', '_'))
                .attr("d", path)
                .attr("fill", "white")
                .style('stroke', 'black')
                .style('stroke-width', 0.3)
                .style("opacity",0.8)

            map
                .append('circle')
                .attr('id', 'marker')
                .attr('cx', 0)
                .attr('cy', 0);

            map
                .append('circle')
                .attr('id', 'marker-radius')
                .attr('cx', 0)
                .attr('cy', 0);
        })
})

function getPaletteColorForRecord(value) {
    switch (value) {
        case 1:
            return '#F9F871'
        case 2:
            return '#fddb66';
        case 3:
            return '#FFC75F'
        case 4:
            return '#ffaa6a'
        case 5:
            return '#FF9671'
        case 6:
            return '#FF6F91'
        case 7:
            return '#e664a4'
        case 8:
            return '#D65DB1'
        case 9:
            return '#a55ebb'
        case 10:
            return '#845EC2'
        case 11:
            return '#4a10aa'
        default:
            return '#26016e'
    }
}

function getAllRecordsPaletteColors() {
    return [
        '#F9F871',
        '#fddb66',
        '#FFC75F',
        '#ffaa6a',
        '#FF9671',
        '#FF6F91',
        '#e664a4',
        '#D65DB1',
        '#a55ebb',
        '#845EC2',
        '#4a10aa',
        '#26016e'
    ]
}

function toggleRecording() {
    recording.value = !recording.value
}

function clearRecords() {
    if (Object.getOwnPropertyNames(records).length === 0) {
        return
    }

    uniqueRecords = {}
    records.value = {}
    recordedMarkers.value = {}
    globeRerender()
}

</script>

<template>

    <div id="title">
        <a href="https://www.prio.org/data/1" target="_blank">PRIO Battledeaths</a> statistic visualization
    </div>

    <div id="spin">

        <div class="box">
            <div id="spin-line" class="border"></div>
            <div class="figure handle">
                <img class="handle" src="./assets/grip-vertical-solid.svg" alt="" style="width: 10px">
            </div>
        </div>

        <div class="box">
            <div class="border"></div>
            <div class="figure handle">
                <img class="handle" src="./assets/grip-vertical-solid.svg" alt="" style="width: 10px">
            </div>
        </div>

    </div>

    <div id="timeline-container"></div>

    <div id="main" class="row">
        <div id="main-left" class="col-xs-6">

            <p style="text-align: center; margin-bottom: 1rem">Sides</p>

            <div class="row">
                <div class="col-xs row">
                    <div class="col-xs-3"></div>
                    <div class="col-xs-3"></div>
                    <div class="col-xs-3 row" style="justify-content: end">
                        <div class="square-color-example square-color-example-left" style="background-color: green"></div>
                    </div>
                    <div class="col-xs-3 row" style="justify-content: start">
                        <div class="square-color-example square-color-example-right" style="background-color: lightgreen; "></div>
                    </div>
                </div>

                <div class="col-xs row">
                    <div class="col-xs-4 row" style="justify-content: end">
                        <div class="square-color-example square-color-example-left" style="background-color: cyan"></div>
                    </div>
                    <div class="col-xs-4 row" style="justify-content: start">
                        <div class="square-color-example square-color-example-right" style="background-color: lightcyan; "></div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-xs-6" style="display: flex; justify-content: end; border-right: 2px solid black;">
                    <div style="margin-top: 1rem; margin-bottom: 1rem">
                        <div v-for="x in sideAReact">
                            <span v-html="x[1]"></span>
                            {{ x[0] }}
                        </div>

                        <div v-for="x in sideA2ndReact" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; -webkit-line-clamp: 1;">
                            <span v-html="x[1]"></span> <span style="color: #888888; text-decoration: underline dotted;">{{ x[0] }}</span>
                        </div>
                    </div>
                </div>
                <div class="col-xs-6">
                    <div style="margin-top: 1rem; margin-bottom: 1rem">


                        <div v-for="x in sideBReact">
                            <span v-html="x[1]" style="vertical-align: middle"></span>
                            {{ x[0] }}
                        </div>

                        <div v-for="x in sideB2ndReact">
                            <span v-html="x[1]" style="vertical-align: middle"></span>
                            <span style="color: #7a7a7a; text-decoration: underline dotted; text-overflow: ellipsis; white-space: nowrap; margin-left: 4px">{{ x[0] }}</span>
                        </div>
                    </div>

                </div>
            </div>

            <div class="info">
                <div class="row">
                    <div class="col-xs-6" style="display: flex; justify-content: end; border-right: 2px solid black;">
                        <span class="help" @click="typeOfConflictModal = true">?</span> Type of conflict
                    </div>

                    <div class="col-xs-6">
                        {{ type }}
                    </div>
                </div>

                <div class="row">
                    <div class="col-xs-6" style="display: flex; justify-content: end; border-right: 2px solid black;">
                        <span class="help" @click="intensityLevelModal = true">?</span> Intensity level
                    </div>

                    <div class="col-xs-6">
                        {{ intensityLevel }}
                    </div>
                </div>

                <div class="row">
                    <div class="col-xs-6" style="display: flex; justify-content: end; border-right: 2px solid black;">
                        <span class="help" @click="cumulativeIntensityModal = true">?</span> Cumulative intensity
                    </div>

                    <div class="col-xs-6">
                        {{ cumulativeIntensity }}
                    </div>
                </div>

                <div class="row">
                    <div class="col-xs-6" style="display: flex; justify-content: end; border-right: 2px solid black;">
                        <span class="help" @click="deathsLowModal = true">?</span> Deaths (low)
                    </div>

                    <div class="col-xs-6" style="color: #f56565">
                        {{ currentBattle?.payload.bdeadlow }}
                    </div>
                </div>

                <div class="row">
                    <div class="col-xs-6" style="display: flex; justify-content: end; border-right: 2px solid black;">
                        <span class="help" @click="deathsHighModal = true">?</span> Deaths (high)
                    </div>

                    <div class="col-xs-6" style="color: #f56565">
                        {{ currentBattle?.payload.bdeadhig }}
                    </div>
                </div>

                <div class="row">
                    <div class="col-xs-6" style="display: flex; justify-content: end; border-right: 2px solid black;">
                        <span class="help" @click="deathsBestModal = true">?</span> Deaths (best)
                    </div>

                    <div class="col-xs-6" style="color: #f56565">
                        {{ currentBattle?.payload.bdeadbes }}
                    </div>
                </div>
            </div>
        </div>
        <div id="main-right" class="col-xs-5">
            <div>
                <span class="help" @click="recordingModal = true">?</span>

                <a @click="toggleRecording" class="toggle-recording">
                    {{ recording ? 'Stop recording' : 'Start recording' }}
                </a>

                <a :class="{'clear-recording': true, 'link-disabled': Object.getOwnPropertyNames(records).length === 0}" @click="clearRecords">Clear</a>
            </div>

            <div id="map"></div>
        </div>

        <div class="col-xs-1" style="display: flex">
            <div class="palette">
                <div
                    v-for="c in getAllRecordsPaletteColors().reverse()"
                    class="palette-cell"
                    :style="{'background-color': c}"
                ></div>
            </div>

            <div class="palette-labels">
                <div class="palette-label">12+</div>
                <div
                    class="palette-label"
                    :style="{'margin-top': 15 * (getAllRecordsPaletteColors().length - 1) + 'px'}"
                >1</div>
            </div>
        </div>

        <Modal
            v-model="typeOfConflictModal"
            title="Type of conflict"
        >
            There are four different types of conflict:

            <ul>
                <li>Extrasystemic</li>
                <li>Interstate</li>
                <li>Internal</li>
                <li>Internationalized internal</li>
            </ul>

            <hr>

            You can read more about it in the dataset documentation
        </Modal>

        <Modal
            v-model="intensityLevelModal"
            title="Intensity level"
        >
            <div style="max-width: 400px; text-align: justify">
                The intensity level in the dyad per calendar year. Two different intensity levels are coded:
                minor armed conflicts and wars
            </div>

            <hr>

            You can read more about it in the dataset documentation
        </Modal>

        <Modal
            v-model="cumulativeIntensityModal"
            title="Cumulative intensity"
        >
            <div style="max-width: 400px; text-align: justify">
                The intensity of the conflict, taking into consideration the conflict history.
            </div>

            <hr>

            You can read more about it in the dataset documentation
        </Modal>

        <Modal
            v-model="deathsLowModal"
            title="Deaths (low)"
        >
            <div style="max-width: 400px; text-align: justify">
                Low estimate of annual battle fatalities. Battle fatalities are defined as civilians and combatants killed in the course of combat in the following manner:
            </div>

            <hr>

            You can read more about it in the dataset documentation
        </Modal>

        <Modal
            v-model="deathsHighModal"
            title="Deaths (high)"
        >
            <div style="max-width: 400px; text-align: justify">
                High estimate of annual battle fatalities.
            </div>

            <hr>

            You can read more about it in the dataset documentation
        </Modal>

        <Modal
            v-model="deathsBestModal"
            title="Deaths (best)"
        >
            <div style="max-width: 400px; text-align: justify">
                Best estimate of annual battle fatalities.
            </div>

            <hr>

            You can read more about it in the dataset documentation
        </Modal>

        <Modal
            v-model="recordingModal"
            title="Recording"
        >
            <div style="max-width: 700px; text-align: justify">
                Place the scan head at the point where you want to start recording events. Click "Start recording".
                Move the head or move/zoom the timeline so that events passing under the head are appeared on the globe.
                Click "Stop recording" if you're done. You can also clear the globe by pressing the corresponding button.
                Below is a visual demonstration of the use of visualization
            </div>

            <img src="guide.gif" alt="test" style="width: 700px">
        </Modal>

        <ModalsContainer />
    </div>
</template>

<style>
#title {
    position: absolute;
    margin-top: 12px;
    text-align: center;
    font-size: 1.1rem;
}

.toggle-recording {
    cursor: pointer;
    user-select: none;
}

.clear-recording {
    cursor: pointer;
    margin-left: 10px;
    user-select: none;
}

.link-disabled {
    color: #888888;
}

.link-disabled:hover {
    background-color: initial;
}

#timeline {
    margin-top: 50px;
    margin-bottom: 50px;
}

.year-labels, .year-label-0, .year-label-1, .year-label-2  {
    transition: opacity 300ms;
}

#spin {
    position: absolute;
    left: v-bind(spinOffset);
    overflow: hidden;
    z-index: 10;
}

.box{
    overflow: hidden;
    margin-top: 210px;
}

.box:first-child{
    margin-top: 0;
}

.border {
    border-right: 3px solid black;
    height: 98%;
    left: 12px;
    position: absolute;
    top: 0;
    width: 1px;
    z-index: -1;
}

.box:last-child .border{
    display: none;
}


.figure {
    background: none repeat scroll 0 0 #dedede;
    border-bottom: 12px solid #FFFFFF;
    border-top: 12px solid #FFFFFF;
    height: 50px;
    width: 25px;

    display: flex;
    justify-content: center;
    cursor: col-resize;
}

#main {
    margin-top: 10px;
}

#main-left {
    height: 300px;
}

#map {
    cursor: grab;
    margin-top: 20px;
}

#main-right {
    height: 400px;
    display: flex;
    align-items: center;

    flex-direction: column; justify-content: stretch; border-left: 1px dashed black;
}

.square-color-example {
    height: 10px;
    width: 10px;
    border: 1px solid black;
}

.square-color-example-left {
    margin-right: 5px;
}

.square-color-example-right {
    margin-left: 5px;
}

.palette {
    display: flex;
    flex-direction: column
}

.palette-cell {
    width: 15px;
    height: 15px;
    margin: 1px 1px;
    border: none;
    border-radius: 2px;
}

.palette-labels {
    display: flex;
    flex-direction: column;
    margin-left: 5px;
}

.palette-label {
    font-size: 0.75rem;
}

.info {
    border-top: 2px solid black;
}

.help {
    cursor: pointer;
    color: #8d8d8d;
    text-decoration: underline;
    margin-right: 10px
}
</style>
