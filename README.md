# Poll-Bot

## Introduktion

## Syntax
Grammatiken för en fråga i Backus-Naur-Form

> <FRÅGA> ::= "!fråga " <FRÅGE_ARGUMENT><FLERA_ARGUMENT>  
> <FRÅGE_ARGUMENT> ::= "{f: " <STRÄNG> "}"  
> <FLERA_ARGUMENT> ::= "" | <FLERA_ARGUMENT> "{" <ETT_ARGUMENT> "}"  
> <ETT_ARGUMENT> ::= "s: " <STRÄNG> | <TAL>":"<TAL>":"<TAL> " " <STRÄNG> | <TAL>":"<TAL>"*:"<TAL> " " <STRÄNG> | "anonym" | "j/n"  
> <STRÄNG> ::= "" | <STRÄNG><KARAKTÄR>  
> <TALL_> ::= <SIFFRA> | <TALL><SIFFRA>  ""
>

En fråga är på formen "!fråga " {ARGUMENT1}{ARGUMENT2}{ARGUMENT3}...{ARGUMENTN}

- {f: DIN FRÅGA HÄR}, argumentet specificerar frågan och är obligatorisk
- {s: ETT SVARSALTERNATIV}, argumentet specificerar ett svarsalternativ och är frivilligt. Upprepa argumentet om du vill ha flera svarsalternativ.
- {TAL1:TAL2:TAL3 STRÄNG1}, argumentet kommer generera svarsalternativ och är frivilligt. Svarsalternativen kommer variera från TAL1 till TAL3 med en differens på TAL2 följt av STRÄNG1
- {TAL1:TAL2:TAL3 STRÄNG1}, argumentet kommer generera svarsalternativ och är frivilligt. Svarsalternativen kommer variera från TAL1 till TAL3 med en kvot på TAL2 följt av STRÄNG1
- {anonym}, argumentet specificerar att du vill vara anonym och är frivilligt, ditt discord-namn kommer då inte finnas på frågan.
- {j/n}, argumentet kommer generera två svarsalternativ till frågan och är frivilligt, ja och nej.

Om du inte specificerar några svarsalternativ kommer frågan istället att generera ett ID. Folk kan då svara på denna fråga genom att skriva "!svar" ID TAL. Genom att ange ett argument {TAL1 TAL2} i frågan kan du begränsa vilka svar som är tillåtna. Svaren måste då vara ligga mellan TAL1 och TAL2.
**Exempel**
!fråga {f: Tycker du om boten?}{j/n}: Kommer generera en fråga med svarsalternativen A: Ja, B: Nej.
!fråga {f: Hur lång är du?}{150:10:180 cm} Kommer generera en fråga med svarsalternativen A: 150 cm, B: 160 cm, C: 170 cm, D: 180 cm.
!fråga {f: Hur mycket pengar har du?}{1000:10*:100000 kr} Kommer generera en fråga med svarsalternativen A: 1000 kr, B: 10000 kr, C: 100000 kr.
!fråga {f: Borde jag äta en pizza eller en hamburgare?}{anonym}{s: En pizza}{s: En hamburgare} Kommer generera en anonym fråga med svarsalternativen A: En pizza, B: En hamburgare.
!fråga {f: Hur gammal är du?}{0 100} Kommer generera en fråga med ID och utan svarsalternativ. Användarna får då svara med !svar ID TAL där TAL måste vara större än 0 och mindre än 100.

## Om projektet

## Hosta projektet online

## Kontakt
Robert Mellberg

robmel@kth.se
