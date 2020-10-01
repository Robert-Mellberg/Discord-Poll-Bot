// JavaScript source code

//Token för discordboten
const TOKEN = 'NzQ4OTk4MTAyNDg0MjU0ODcx.X0lk1w.Cer4NSLl85zpxRmnFglH2kW9rVc';
//Det som man ska skriva innan en fråga
const PREFIX = '!fråga ';
//Emojis som man får som svarsalternativ att reagera på.
const REACTIONS = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿'];
//Max antal reaktioner, också max antal svarsalternativ.
const MAXREACTIONS = 10;
//Max antal ID som kan vara aktiva åt gången, ett högre AMOUNTOFIDS desto längre blir ID:t
const AMOUNTOFIDS = 10000;
//Giltighetstiden för frågan i millisekunder (604800000 = 1 vecka)
const VALIDITYPERIOD = 604800000;
//Hjälpmeddelandet för hur boten fungerar
const HELPMESSAGE = "En fråga är på formen **!fråga ARGUMENT|ARGUMENT|ARGUMENT|...|ARGUMENT**. Argumenten kan vara:\n\n" +
	"```bash\n" + 
	"\"f: DIN FRÅGA HÄR\" eller \"DIN FRÅGA HÄR?\", argumentet specificerar frågan och är obligatorisk\n\n" +
	"\"s: ETT SVARSALTERNATIV\" eller \"ETT SVARSALTERNATIV\", argumentet specificerar ett svarsalternativ och är frivilligt. Upprepa argumentet om du vill ha flera svarsalternativ.\n\n" +
	"\"TAL1:TAL2:TAL3 STRÄNG\", argumentet genererar svarsalternativ och är frivilligt. Svarsalternativen kommer variera från TAL1 till TAL3 med en differens på TAL2, följt av STRÄNG\n\n" +
	"\"TAL1:TAL2*:TAL3 STRÄNG\", argumentet genererar svarsalternativ och är frivilligt. Svarsalternativen kommer variera från TAL1 till TAL3 med en kvot på TAL2, följt av STRÄNG\n\n" +
	"\"anonym\", argumentet specificerar att du vill vara anonym och är frivilligt, ditt discord-namn kommer då inte finnas på frågan.\n\n" +
	"\"j/n\", argumentet genererar två svarsalternativ till frågan och är frivilligt, ja och nej.```\n\n" +
	"Om du inte specificerar några svarsalternativ kommer frågan istället att generera ett ID. Folk kan då svara på denna fråga genom att skriva **!svar ID TAL**. Genom att ange ett argument **TAL1 TAL2** i frågan kan du begränsa vilka svar som är tillåtna.Svaren måste då vara ligga mellan TAL1 och TAL2.\n\n" +
	"Exempel:\n" +
	"**!fråga Tycker du om boten?|j/n** Kommer generera en fråga med svarsalternativen A: Ja, B: Nej.\n\n" +
	"**!fråga Hur lång är du?|150:10:180 cm** Kommer generera en fråga med svarsalternativen A: 150 cm, B: 160 cm, C: 170 cm, D: 180 cm.\n\n" +
	"**!fråga Hur mycket pengar har du?|1000:10*:100000 kr** Kommer generera en fråga med svarsalternativen A: 1000 kr, B: 10000 kr, C: 100000 kr.\n\n" +
	"**!fråga Borde jag äta en pizza eller en hamburgare?|anonym|En pizza|En hamburgare** Kommer generera en anonym fråga med svarsalternativen A: En pizza, B: En hamburgare.\n\n" +
	"**!fråga Hur gammal är du?|0 100** Kommer generera en fråga med ID och utan svarsalternativ.Användarna får då svara med **!svar ID TAL** där TAL måste vara större än 0 och mindre än 100.\n\n";


const WARNINGTOOMANYARGUMENTS = "Varning: Du kan inte ha mer än " + MAXREACTIONS + " argument, argumenten efter de första " + MAXREACTIONS + " argumenten ignorerades.\n";
const DISCORD = require('discord.js');
const BOT = new DISCORD.Client();
const FILTER = (reaction, user) => {
	return user !== BOT.user;
};

//Variabler som håller koll på giltiga ID och antal lediga ID.
let amountOfAvailableIDs = AMOUNTOFIDS;
let availableIDs = [];
availableIDs.length = AMOUNTOFIDS;
availableIDs.fill(true);


/**
 * Returnerar dagens datum som en sträng i formatet yyyy-mm-dd
 * */
function getDate() {
	let today = new Date();
	let dd = String(today.getDate()).padStart(2, '0');
	let mm = String(today.getMonth() + 1).padStart(2, '0');
	let yyyy = today.getFullYear();

	return yyyy + '-' + mm + '-' + dd;
}

/**
 * Beräknar medelvärdet av en uppsättning av tal
 * 
 * @param {any} occurrences Elementet på plats n anger hur många värden det finns av values på plats n
 * @param {any} values Värdena
 */
function calculateMeanValue(occurrences, values) {
	let meanValue = 0;
	let totalOccurrences = 0;
	for (let i = 0; i < occurrences.length; i++) {
		meanValue += occurrences[i] * values[i];
		totalOccurrences += occurrences[i];
	}

	meanValue /= Math.max(totalOccurrences, 1);
	return meanValue;
}

/**
 * Beräknar standardavvikelsen
 * 
 * @param {any} occurrences Elementet på plats n anger hur många värden det finns av values på plats n
 * @param {any} values Värdena
 * @param {any} meanValue Medelvärdet av uppsättningen
 */
function calculateStandardDeviation(occurrences, values, meanValue) {

	let standardDeviation = 0;
	let totalOccurrences = 0;
	for (let i = 0; i < occurrences.length; i++) {
		standardDeviation += Math.pow(values[i] - meanValue, 2) * occurrences[i];
		totalOccurrences += occurrences[i];
	}
	standardDeviation = Math.sqrt(standardDeviation / Math.max(totalOccurrences, 1));
	return standardDeviation;
}

/**
 * Uppdaterar statet och redigerar meddelandet.
 * 
 * @param {any} reaction Reaktionen användaren använde
 * @param {any} user Användaren kopplad till reaktionen
 * @param {any} state Statet, ska innehålla variablerna botMessage, message, allAlternatives, embed, totalReactions, onlyNumbers, collector
 * @param {any} increment Anger hur stor tyngd reaktionen ska ha, 1 om reaktionen läggs till och -1 om reaktionen tas bort
 */
function updateState(reaction, user, state, increment) {
	if (reaction.emoji.name === '❌' && user === state.message.author) {
		state.collector.stop();
		state.botMessage.delete({ timeout: 1000 });
		return;
	}
	foundReaction = false;
	state.allAlternatives.forEach(alternative => {
		if (alternative[0] === reaction.emoji.name) {
			state.totalReactions += increment;
			alternative[2] += increment;
			foundReaction = true;
		}
	});
	if (!foundReaction) {
		reaction.remove();
	}

	descript = "";

	state.allAlternatives.forEach(element => {
		descript += element[0] + ": " + element[1] + " (" + (element[2] / Math.max(state.totalReactions, 1) * 100).toFixed(2) + "%)" + "\n\n";
	});
	if (state.onlyNumbers) {
		[values, occurrences] = [state.allAlternatives.map(x => parseInt(x[1].split(" ", 1)[0])), state.allAlternatives.map(x => parseInt(x[2]))];
		let meanValue = calculateMeanValue(occurrences, values);
		let standardDeviation = calculateStandardDeviation(occurrences, values, meanValue);
		descript += "**Medelvärde**: " + meanValue.toFixed(2) + "\n **Standardavvikelse**: " + standardDeviation.toFixed(2);
	}
	state.botMessage.edit(state.embed.setDescription(descript));
}

/**
 * Startar en lyssnare för reaktioner
 * 
 * @param {any} botMessage Meddelandet som boten skapade och som personer ska reagera på
 * @param {any} message Meddelandet som personen som skapade frågan skrev
 * @param {any} allAlternatives Alla svarsalternativ, där ett svarsalternativ är på formen [emoji, svarstext, antal reaktioner på detta svar]
 * @param {any} embed embeded som botMessage innehåller
 * @param {any} onlyNumbers	True om svarsalternativen endast består av siffror
 */
function setUpReactionHandeler(botMessage, message, allAlternatives, embed, onlyNumbers) {

	allAlternatives.forEach(element => {
	
		botMessage.react(element[0]);
		
	});


	const collector = botMessage.createReactionCollector(FILTER, { time: VALIDITYPERIOD, dispose: true });
	let state = { botMessage: botMessage, message: message, allAlternatives: allAlternatives, embed: embed, totalReactions: 0, onlyNumbers: onlyNumbers, collector: collector };
	collector.on('collect', (reaction, user) => {
		updateState(reaction, user, state, 1);

	});

	collector.on('remove', (reaction, user) => {
		updateState(reaction, user, state, -1);
	});

	collector.on('end', () => {

		botMessage.edit(embed.addField('Denna fråga har gått ut', getDate()));
	});


}
/**
 * Tar emot ett meddelande skrivet till botens meddelande (som finns i statet) och uppdaterar botens meddelande.
 * 
 * @param {any} message Meddelandet skrivet av en användare som svar till boten.
 * @param {any} state Ett state som består av messageID, restrictions, allAnswers, botMessage, embed
 */
function reactOnMessage(message, state) {

	let regex = new RegExp('^!(ans|answer|svar|svara)\\s*' + state.messageID + '\\s+');
	let number = message.content.replace(regex, "");
	if (state.restrictions.min != null) {
		if (number < state.restrictions.min) {
			message.author.send("Ditt svar är för litet, talet måste vara större än " + state.restrictions.min + " och mindre än " + state.restrictions.max);
			return;
		}
		else if (number > state.restrictions.max) {
			message.author.send("Ditt svar är för stort, talet måste vara större än " + state.restrictions.min + " och mindre än " + state.restrictions.max);
			return;
		}
	}


	state.allAnswers[message.author] = number;

	let occurrences = []; let values = [];
	for (var key in state.allAnswers) {
		var answer = state.allAnswers[key];
		occurrences.push(1);
		values.push(answer);
	}

	let meanValue = calculateMeanValue(occurrences, values);
	let standardDeviation = calculateStandardDeviation(occurrences, values, meanValue);
	let descript = "ID: " + state.messageID + "\n";
	if (state.restrictions.min != null) {
		descript += "Ange ett tal mellan " + state.restrictions.min + " och " + state.restrictions.max + "\n";
	}
	descript += "**Antal svar**: " + values.length + "\n" + "**Medelvärde**: " + meanValue.toFixed(2) + "\n **Standardavvikelse**: " + standardDeviation.toFixed(2);

	state.botMessage.edit(state.embed.setDescription(descript));
}

/**
 * Genererar ett ID till botens meddelande. Sätter sedan upp en lyssnare för meddelanden som svarar med botens ID
 * 
 * @param {any} botMessage Botens meddelande
 * @param {any} message Meddelandet som personen som skapade frågan skrev
 * @param {any} embed Embed på botens meddelande
 * @param {any} restrictions Restriktioner på svaren, på formen [min, max] där svaret måste ligga mellan min och max. Ignoreras om min är null
 */
function setUpMessageHandeler(botMessage, message, embed, restrictions) {
	let messageID = Math.floor(Math.random() * AMOUNTOFIDS);
	while (!availableIDs[messageID]) {
		messageID = (messageID + 1) % AMOUNTOFIDS;
	}
	availableIDs[messageID] = false;
	amountOfAvailableIDs--;
	descript = "ID: " + messageID + "\n";
	if (restrictions.min != null) {
		descript += "Ange ett tal mellan " + restrictions.min + " och " + restrictions.max + "\n";
	}
	botMessage.edit(embed.setDescription(descript));

	const messageFilter = m => {
		let regex = new RegExp('^!(ans|answer|svar|svara)\\s*' + messageID + '\\s+-?\\d+(\\.\\d+)?\\s*$');
		return regex.test(m.content);
	};
	const messageCollector = message.channel.createMessageCollector(messageFilter, { time: VALIDITYPERIOD, dispose: true });
	let state = { messageID: messageID, restrictions: restrictions, allAnswers: [], botMessage: botMessage, embed: embed};
	messageCollector.on('collect', m => {
		reactOnMessage(m, state);
	});

	messageCollector.on('end', () => {
		availableIDs[messageID] = true;
		amountOfAvailableIDs++;

	});

	const collector = botMessage.createReactionCollector(FILTER, { time: VALIDITYPERIOD, dispose: true });
	collector.on('collect', (reaction, user) => {
		if (reaction.emoji.name === '❌' && user === message.author) {
			messageCollector.stop();
			botMessage.delete({ timeout: 1000 });
		}

	});
}

function addAnswer(state, answer) {
	if (state.allAlternatives.length >= MAXREACTIONS) {
		state.warnings += WARNINGTOOMANYARGUMENTS;
		return;
	}
	state.allAlternatives.push([REACTIONS[state.currLetter], answer, 0]);
	state.currLetter++;
	state.onlyNumbers &= !isNaN(answer.split(" ", 1)[0]);
}

/**
 * Parsear argumentet som användaren skrev in, antingen på formen {num:num:num text} eller {num:num*:num text}. Lägger in alternativen i state.Allalternatives
 * 
 * @param {any} state State som håller koll på resultaten av alla argument, med variablerna title, addAuthor, yesNo, currLetter, allAlternatives, onlyNumbers, errors, warnings, restrictions
 * @param {any} incrementFunction Funktionen som utifrån ett svarsalternativ beräknar fram nästa svarsalternativ
 * @param {any} argument Argumentet användaren skrev in
 */
function parseInterval(state, incrementFunction, argument) {
	let arr = argument.split(/:|\s/);
	let result = arr.splice(0, 3);

	let extraText = " " + arr.join(' ');

	[lowerBound, increment, upperBound] = [parseFloat(result[0]), parseFloat(result[1]), parseFloat(result[2])];

	for (let n = lowerBound; n <= upperBound; n = incrementFunction(n, increment)) {
		if (state.allAlternatives.length >= MAXREACTIONS) {
			state.warnings += WARNINGTOOMANYARGUMENTS;
			break;
		}
		state.allAlternatives.push([REACTIONS[state.currLetter], n + extraText, 0]);
		state.currLetter++;
	}
}

/**
 * Parsear hela inputen användaren skrev in och returnerar ett state med resultaten
 * State innehåller [addAuthor, title, allAlternatives, onlyNumbers, errors, warnings, restrictions]
 * 
 * @param {any} input Strängen på frågeskaparens meddelande
 */
function parseInput(input) {


	let args = input.substr(PREFIX.length).split(/}|{|]|\[|\||--/);
	

	let state = { title: "", addAuthor: true, yesNo: false, currLetter: 0, allAlternatives: [], onlyNumbers: true, errors: "", warnings: "", restrictions: { min: null, max: null } };

	for (let i = 0; i < args.length; i++) {
		argument = args[i];
		argument = argument.replace(/^\s+|\s+$/, "");
		//eg. 10.00:10.00:100.00 test
		if (/^-?(\d+(\.\d+)?:){2}-?\d+(\.\d+)?(\s.*)?$/.test(argument)) {

			incrementFunction = (n, increment) => { return n + increment };
			parseInterval(state, incrementFunction, argument);

		}
		//eg. 10.00:10.00*:100.00 test
		else if (/^-?(\d+)(\.\d+)?:(\d+)(\.\d+)?\*:-?(\d+)(\.\d+)?(\s.*)?$/.test(argument)) {

			incrementFunction = (n, increment) => { return n * increment };
			parseInterval(state, incrementFunction, argument);

		}
		//eg. f: är detta en fråga?
		else if (/^(f|q)\s*:\s*.+$/i.test(argument)) {
			argument = argument.replace(/^(f|q)\s*:\s*/i, "");
			state.title = argument;
		}
		//eg. s: detta är ett svar.
		else if (/^(a|s)\s*:\s*.+$/i.test(argument)) {
			argument = argument.replace(/^(s|a)\s*:\s*/i, "");
			addAnswer(state, argument);
		}
		//anonym
		else if (/^anonym$/i.test(argument)) {
			state.addAuthor = false;
		}
		//eg. j/n eller y/n (ja och nej alternativ)
		else if (/^(j|y)\/n$/i.test(argument) && !state.yesNo) {
			if (state.allAlternatives.length >= MAXREACTIONS - 1) {
				state.warnings += WARNINGTOOMANYARGUMENTS;
				continue;
			}
			state.allAlternatives.push(['👍', "Ja", 0]);
			state.allAlternatives.push(['👎', "Nej", 0]);
			state.onlyNumbers = false;
			state.yesno = true;
		}
		//eg. 0 100	anger ett intervall för vad svaret får ligga mellan
		else if (/^-?\d+(\.\d+)?\s+-?\d+(\.\d+)?/.test(argument)) {
			numbers = argument.split(/\s+/);
			[t1, t2] = [parseFloat(numbers[0]), parseFloat(numbers[1])];
			state.restrictions.min = Math.min(t1, t2);
			state.restrictions.max = Math.max(t1, t2);
		}
		//eg. Är detta en fråga?
		else if (/.+\?/.test(argument)) {
			state.title = argument;
		}
		//eg. Detta är ett svar.
		else if (/.+/.test(argument)) {
			addAnswer(state, argument);
        }
	}

	if (state.title === "") {
		state.errors += "Error: Du måste ställa en fråga, gör detta med argumentet \"f: Din fråga här\" t.ex \"f: Är risgrynsgröt gott?\" eller bara: \"Är risgrynsgröt gott?\".\n";
	}
	if (state.allAlternatives.length !== 0 && state.restrictions.min !== null) 
		state.warnings += "Varning: Restriktioner som du har angivit ignorerades eftersom du också angivit svarsalternativ\n";
	if (state.allAlternatives.length === 0 && amountOfAvailableIDs === 0) 
		state.errors += "Error: Det finns inget ledigt ID för din fråga, vänta tills en tidigare ställd går ut\n";

	return [state.addAuthor, state.title, state.allAlternatives, state.onlyNumbers, state.errors, state.warnings, state.restrictions];

}

BOT.on('ready', () => {
	console.log("online");
});

/**
 * Sätter upp en lyssnare som lyssnar på användares meddelanden, och kollar om meddelandet börjar med PREFIX.
 * Parsear meddelandet och skickar errors eller varningar om dem finns. Om metoden skickar något error avbryts metoden.
 * 
 * Om det inte finns något error skapar metoden frågan.
 * 
 */
BOT.on('message', message => {
	if (message.content.substr(0, PREFIX.length).toLowerCase() == PREFIX) {
		message.delete();
		let [addAuthor, title, allAlternatives, onlyNumbers, errors, warnings, restrictions] = parseInput(message.content);
		if (errors !== "") {
			message.author.send(errors);
			return;
		}
		if (warnings !== "") {
			message.author.send(warnings);
		}

		let embed = new DISCORD.MessageEmbed();
		let descript = "";
		allAlternatives.forEach(element => {
			descript += element[0] + ": " + element[1] + "\n\n";
		});


		if (addAuthor) {
			embed.setAuthor(message.member.displayName);
		}
		embed.setTitle(title);

		embed.setDescription(descript);
		if (allAlternatives.length !== 0) {

			message.channel.send(embed).then(botMessage => {

				setUpReactionHandeler(botMessage, message, allAlternatives, embed, onlyNumbers);
			});
		}
		else {

			message.channel.send(embed).then(botMessage => {

				setUpMessageHandeler(botMessage, message, embed, restrictions);
			});
		}

	}
	else if (/^!(ans|answer|svar|svara)\s*/.test(message.content)) {
		message.delete();
		res = message.content.replace(/^!(answer|svara)\s*/, "");
		res = res.replace(/^!(ans|svar)\s*/, "").split(" ")[0];
		if (res == "" || isNaN(res))
			message.author.send("Det ID du angav kunde inte tolkas");
		else {
			let ID = parseInt(res);
			if (availableIDs[ID] || ID < 0 || ID >= AMOUNTOFIDS)
				message.author.send("Det ID du har angivit (" + ID + ") är inte giltigt.");
		}
	}
	else if (/!(hjälp|help)/.test(message.content)) {
		message.delete();
		message.author.send(HELPMESSAGE);
    }
	
});

/**
 * Loggar in
 */
//BOT.login(TOKEN);
BOT.login(process.env.BOT_TOKEN);
