// // 1 authenticate guardian
// import { parseMessage } from './service'

// // eslint-disable-next-line object-curly-spacing, @typescript-eslint/quotes
// // const mes = {"checkins":"sent*0*0|queued*628*66174138|meta*11854*5924516|skipped*79*18308877|stashed*1794*189918047|archived*95770*16473998336|vault*0*0","audio":"1671595598374*1671595534528*opus*69709cec6e52676319112fc10f134c738c2ee417*12000*16384*opus*vbr*1796*16bit*60000","queued_at":1671595598460,"cpu":"1671385195394*7*329*113|1671385236216*6*303*113|1671385155212*9*400*113|1671385074457*8*341*113|1671385115005*6*244*113|1671385034249*9*341*113|1671384953487*9*341*114|1671384994139*5*361*113|1671384913231*8*380*114|1671384832447*7*332*114|1671384873097*6*351*114|1671384792170*8*419*114|1671384711434*9*303*114|1671384752037*6*244*114|1671384671132*8*303*114|1671384590485*6*255*115|1671384631021*7*271*114|1671384550261*8*458*115|1671384469400*8*326*115|1671384510190*6*578*115|1671384429212*7*364*115|1671384348470*6*344*116|1671384389103*7*303*115|1671384308209*8*356*116","network":"1671385101688*-85*hsdpa*dtac.BetterTogether|1671384963423*-85*hsdpa*dtac.BetterTogether|1671384832852*-85*hsdpa*dtac.BetterTogether|1671384733026*-85*hsdpa*dtac.BetterTogether|1671384594797*-85*hsdpa*dtac.BetterTogether|1671384502623*-85*hsdpa*dtac.BetterTogether|1671384356715*-85*hsdpa*dtac.BetterTogether|1671384228707*-85*hsdpa*dtac.BetterTogether","memory":"system*1671385195596*312401920*169250816*57702400|system*1671385074675*310820864*170831872*57702400|system*1671384953668*319909888*161742848*57702400|system*1671384832675*341745664*139907072*57702400|system*1671384711606*341991424*139661312*57702400|system*1671384590678*341622784*140029952*57702400|system*1671384469588*341155840*140496896*57702400|system*1671384348685*340774912*140877824*57702400","sentinel_power":"system*1671385164680*3307*217*35*719|system*1671385204823*3306*215*35*711|input*1671385164680*100*10*256*0|input*1671385204823*100*10*256*0|battery*1671385164680*3327*-216*86.62*-718|battery*1671385204823*3328*-213*86.61*-710|system*1671385124592*3305*220*35*727|input*1671385124592*100*10*256*0|battery*1671385124592*3328*-218*86.63*-726|system*1671385044533*3307*217*35*718|system*1671385084566*3307*223*35*737|input*1671385044533*100*10*256*0|input*1671385084566*100*10*256*0|battery*1671385044533*3328*-216*86.66*-718|battery*1671385084566*3327*-221*86.65*-736|system*1671385004513*3306*218*35*721|input*1671385004513*100*10*256*0|battery*1671385004513*3328*-217*86.67*-721|system*1671384924298*3307*212*35*702|system*1671384964433*3306*216*35*714|input*1671384924298*100*10*256*0|input*1671384964433*100*10*256*0|battery*1671384924298*3328*-211*86.70*-702|battery*1671384964433*3328*-214*86.69*-713|system*1671384884183*3307*220*35*726|input*1671384884183*100*10*256*0|battery*1671384884183*3328*-218*86.71*-726|system*1671384804206*3306*217*35*718|system*1671384844213*3306*227*35*749|input*1671384804206*100*10*256*0|input*1671384844213*100*10*256*0|battery*1671384804206*3328*-216*86.74*-718|battery*1671384844213*3328*-225*86.73*-749|system*1671384764160*3306*220*35*726|input*1671384764160*100*10*256*0|battery*1671384764160*3328*-218*86.75*-726|system*1671384684054*3307*219*35*725|system*1671384724169*3306*214*35*706|input*1671384684054*100*10*256*0|input*1671384724169*100*10*256*0|battery*1671384684054*3328*-218*86.78*-724|battery*1671384724169*3328*-212*86.77*-706|system*1671384644047*3307*217*35*717|input*1671384644047*100*10*256*0|battery*1671384644047*3328*-215*86.79*-716|system*1671384563766*3306*219*35*723|system*1671384603878*3306*224*35*741|input*1671384563766*100*10*256*0|input*1671384603878*100*10*256*1|battery*1671384563766*3327*-217*86.82*-723|battery*1671384603878*3328*-223*86.81*-741|system*1671384523639*3306*227*35*750|input*1671384523639*100*10*256*0|battery*1671384523639*3327*-225*86.83*-750|system*1671384443069*3306*223*35*738|system*1671384483390*3307*220*35*726|input*1671384443069*100*10*256*0|input*1671384483390*100*10*256*0|battery*1671384443069*3327*-222*86.86*-738|battery*1671384483390*3328*-218*86.85*-726|system*1671384402980*3306*218*35*721|input*1671384402980*100*10*256*0|battery*1671384402980*3327*-217*86.87*-720|system*1671384322917*3305*228*35*754|system*1671384362956*3307*219*35*726|input*1671384322917*100*10*256*0|input*1671384362956*100*10*256*0|battery*1671384322917*3327*-227*86.90*-754|battery*1671384362956*3328*-218*86.89*-725|system*1671384282876*3307*213*35*706|input*1671384282876*100*10*256*0|battery*1671384282876*3328*-212*86.92*-705","purged":"meta*1671386261535|meta*1671386321618|meta*1671386381720|meta*1671386441804|meta*1671386501899|meta*1671386562024|meta*1671386622057|meta*1671386682156|meta*1671386742471|meta*1671386802597|meta*1671386862804|meta*1671386922881|meta*1671386982960|meta*1671387043119|meta*1671387103078|meta*1671387163159|audio*1671595594649","software":"guardian*1.1.7|admin*1.1.7|classify*1.1.4|updater*1.0.0","prefs":{"sha1":"d3010c7d50ebce64"},"measured_at":"1671385180201","battery":"1671385195496*100*25*0*1|1671385074577*100*25*0*1|1671384953571*100*25*0*1|1671384832562*100*25*0*1|1671384711509*100*25*0*1|1671384590570*100*25*0*1|1671384469486*100*25*0*1|1671384348581*100*25*0*1","library":{"audio":[],"classifiers":[{"guid":"chainsaw-v5","id":"1617208867756"}]},"meta_ids":["1671385240244","1671385180201","1671385120093","1671385060042","1671384999954","1671384939950","1671384879807","1671384819747","1671384759659","1671384699572","1671384639453","1671384579356","1671384519281","1671384459223","1671384399073","1671384339035"],"data_transfer":"1671385155250*1671385195435*0*0*7253*1751*0*0*0*384|1671385195435*1671385236270*0*0*7253*1751*0*0*0*384|1671385115048*1671385155250*0*0*7253*1751*0*0*0*384|1671385034294*1671385074539*0*0*7253*1751*0*0*0*384|1671385074539*1671385115048*0*0*7253*1751*0*0*0*384|1671384994183*1671385034294*0*0*7253*1751*0*0*0*384|1671384913289*1671384953535*0*0*7253*1751*0*0*0*384|1671384953535*1671384994183*0*0*7253*1751*0*0*0*384|1671384873147*1671384913289*0*0*7253*1751*0*0*0*384|1671384792232*1671384832507*0*0*7253*1751*0*0*0*384|1671384832507*1671384873147*0*0*7253*1751*0*0*0*384|1671384752081*1671384792232*0*0*7253*1751*0*0*0*384|1671384671201*1671384711468*0*0*7253*1751*0*0*0*384|1671384711468*1671384752081*0*0*7253*1751*0*0*0*384|1671384631077*1671384671201*0*0*7253*1751*0*0*0*384|1671384550313*1671384590535*0*0*7253*1751*0*0*0*384|1671384590535*1671384631077*0*0*7253*1751*0*0*0*384|1671384510234*1671384550313*0*0*7253*1751*0*0*0*384|1671384429253*1671384469443*0*0*7253*1751*0*0*0*384|1671384469443*1671384510234*0*0*7253*1751*0*0*0*384|1671384389148*1671384429253*0*0*7253*1751*0*0*0*384|1671384308261*1671384348542*0*0*7253*1751*0*0*0*384|1671384348542*1671384389148*0*0*7253*1751*0*0*0*384|1671384268107*1671384308261*0*0*7253*1751*0*0*0*384","storage":"internal*1671385195530*1298522112*66887680|external*1671385195530*16692019200*111141158912|internal*1671385074611*1298522112*66887680|external*1671385074611*16692019200*111141158912|internal*1671384953604*1298518016*66891776|external*1671384953604*16692019200*111141158912|internal*1671384832605*1298513920*66895872|external*1671384832605*16692019200*111141158912|internal*1671384711545*1298513920*66895872|external*1671384711545*16692019200*111141158912|internal*1671384590611*1298513920*66895872|external*1671384590611*16692019200*111141158912|internal*1671384469523*1298509824*66899968|external*1671384469523*16692019200*111141158912|internal*1671384348618*1298509824*66899968|external*1671384348618*16692019200*111141158912"}

// import { readFile, existsSync } from 'fs'

// console.log('\n\nexists', existsSync('./test/mqtt-message'))

// readFile('./test/mqtt-message', async (err, data) => {
//   await parseMessage(data)
// })
// //   .then(() => {

// //   })