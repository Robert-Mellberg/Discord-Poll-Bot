# Poll-Bot

## Introduktion

![Demo Video](DemoVideo.gif)

<video width="320" height="240" controls>
  <source src="Redigerad video.mp4" type="video/mp4">
</video>

**OBS: Syntaxen i videon är utdaterad**

## Bjud in boten till din server
https://discord.com/oauth2/authorize?client_id=748998102484254871&scope=bot&permissions=1073769536

Skriv **!hjälp** för att få instruktioner för hur man använder den eller läs syntaxen nedan.

Observera att du måste ge boten de behörigheter den efterfrågar för att kunna utnyttja alla funktionaliteter.

## Syntax
Grammatiken för en fråga i Backus-Naur-Form

> \<FRÅGA\> ::= "!fråga " \<FRÅGE_ARGUMENT\>\<FLERA_ARGUMENT\>  
>
> \<FRÅGE_ARGUMENT\> ::= "f: " \<STRÄNG\> | \<STRÄNG\> "?"  
>
> \<FLERA_ARGUMENT\> ::= "" | \<AVSKILJARE\> \<ETT_ARGUMENT\> \<FLERA_ARGUMENT\>
>
> \<ETT_ARGUMENT\> ::= "s: " \<STRÄNG\> | \<TAL\>":"\<TAL\>":"\<TAL\> " " <STRÄNG> | \<TAL\>":"\<TAL\>"*:"\<TAL\> " " \<STRÄNG\> | "anonym" | "j/n" | \<STRÄNG\> 
>
> \<STRÄNG\> ::= "" | \<STRÄNG\>\<KARAKTÄR\>  
>
> \<TAL\> ::= \<SIFFRA\> | \<TAL\>\<SIFFRA\>  ""
>
> \<AVSKILJARE\> ::= ("|" | "}" | "{" | "]" | "\[" | "--") \<AVSKILJARE\>
>

En fråga är på formen !fråga ARGUMENT<sub>1</sub>|ARGUMENT<sub>2</sub>|ARGUMENT<sub>3</sub>|...|ARGUMENT<sub>N</sub>. Argumentet kan vara:

- **f: DIN FRÅGA HÄR** eller **DIN FRÅGA HÄR?**, argumentet specificerar frågan och är obligatorisk
- **s: ETT SVARSALTERNATIV** eller **ETT SVARSALTERNATIV**, argumentet specificerar ett svarsalternativ och är frivilligt. Upprepa argumentet om du vill ha flera svarsalternativ.
- **TAL<sub>1</sub>:TAL<sub>2</sub>:TAL<sub>3</sub> STRÄNG1**, argumentet genererar svarsalternativ och är frivilligt. Svarsalternativen kommer variera från TAL<sub>1</sub> till TAL<sub>3</sub> med en differens på TAL<sub>2</sub> följt av STRÄNG<sub>1</sub>
- **TAL<sub>1</sub>:TAL<sub>2</sub>\*:TAL<sub>3</sub> STRÄNG1**, argumentet genererar svarsalternativ och är frivilligt. Svarsalternativen kommer variera från TAL<sub>1</sub> till TAL<sub>3</sub> med en kvot på TAL<sub>2</sub> följt av STRÄNG<sub>1</sub>
- **anonym**, argumentet specificerar att du vill vara anonym och är frivilligt, ditt discord-namn kommer då inte finnas på frågan.
- **j/n**, argumentet genererar två svarsalternativ till frågan och är frivilligt, ja och nej.

Om du inte specificerar några svarsalternativ kommer frågan istället att generera ett ID. Folk kan då svara på denna fråga genom att skriva **!svar ID TAL**. Genom att ange ett argument **{TAL<sub>1</sub> TAL<sub>2</sub>}** i frågan kan du begränsa vilka svar som är tillåtna. Svaren måste då vara ligga mellan TAL<sub>1</sub> och TAL<sub>2</sub>. 

**Exempel**  

**!fråga Tycker du om boten?|j/n** Kommer generera en fråga med svarsalternativen A: Ja, B: Nej.  

**!fråga Hur lång är du?|150:10:180 cm** Kommer generera en fråga med svarsalternativen A: 150 cm, B: 160 cm, C: 170 cm, D: 180 cm.  

**!fråga Hur mycket pengar har du?|1000:10\*:100000 kr** Kommer generera en fråga med svarsalternativen A: 1000 kr, B: 10000 kr, C: 100000 kr.  

**!fråga Borde jag äta en pizza eller en hamburgare?|anonym|s: En pizza|s: En hamburgare** Kommer generera en anonym fråga med svarsalternativen A: En pizza, B: En hamburgare.  

**!fråga Hur gammal är du?|0 100** Kommer generera en fråga med ID och utan svarsalternativ. Användarna får då svara med !svar ID TAL där TAL måste vara större än 0 och mindre än 100.  

## Kontakt
Robert Mellberg

robmel@kth.se
