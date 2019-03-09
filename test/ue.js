var i = require("../"),
	tap = require("tap"),
	test = tap.test,
	fs = require("fs"),
	eol = require("os").EOL,
	path = require("path"),
	fixture1 = path.resolve(__dirname, "./fixtures/ue1.ini"),
	fixture2 = path.resolve(__dirname, "./fixtures/ue2.ini"),
	data1 = fs.readFileSync(fixture1, "utf8"),
	data2 = fs.readFileSync(fixture2, "utf8"),
	expectA = `[/Script/EngineSettings.GeneralProjectSettings]
ProjectID=projectidprojectprojectid
ProjectDisplayedTitle=NSLOCTEXT("[/Script/EngineSettings]", "fafafafafafa", "gamename")
ProjectName=gamename
CopyrightNotice=Copyright Counterplay Games Inc 2018
CompanyName=Counterplay Games Inc.
Homepage=www.counterplaygames.com
ProjectVersion=0.0.0

[/Script/GameplayTriggers.GameplayTriggersManager]
AllowedTriggerTypeRootTags=(TagName="Trigger")
+AllowedTriggerTypeRootTags=(TagName="Action1")
+AllowedTriggerTypeRootTags=(TagName="Action2")
+AllowedTriggerTypeRootTags=(TagName="Action3")

[/Script/GameplayAbilities.AbilitySystemGlobals]
-MapsToCook=(FilePath="/Game/Game/Maps/Menu/Menu_Home")
+DirectoriesToAlwaysCook=(Path="Movies")
+DirectoriesToAlwaysCook=(Path="Game/Blueprints/Cues")
`,
	expectB = {
		"/Script/EngineSettings.GeneralProjectSettings": {
			ProjectID: "projectidprojectprojectid",
			ProjectDisplayedTitle:
				'NSLOCTEXT("[/Script/EngineSettings]", "fafafafafafa", "gamename")',
			ProjectName: "gamename",
			CopyrightNotice: "Copyright Counterplay Games Inc 2018",
			CompanyName: "Counterplay Games Inc.",
			Homepage: "www.counterplaygames.com",
			ProjectVersion: "0.0.0",
		},
		"/Script/GameplayTriggers.GameplayTriggersManager": {
			AllowedTriggerTypeRootTags: '(TagName="Trigger")',
			"+AllowedTriggerTypeRootTags": [
				'(TagName="Action1")',
				'(TagName="Action2")',
				'(TagName="Action3")',
			],
		},
		"/Script/GameplayAbilities.AbilitySystemGlobals": {
			AbilitySystemGlobalsClassName: "/Script/SystemGlobals",
			GlobalGameplayCueManagerClass: "/Script/CueManager",
			GameplayCueNotifyPaths: "/Game/Blueprints/Cues",
			GlobalAttributeSetDefaultsTableNames:
				"/Game/Data/Gameplay/Attributes/CT_Attributes_Defaults.CT_Attributes_Defaults",
			"+GlobalAttributeSetDefaultsTableNames": [
				"/Game/Data/Gameplay/Attributes/CT_Attributes_Character_Defaults.CT_Attributes_Character_Defaults",
				"/Game/Data/Gameplay/Attributes/CT_Attributes_Character_Player.CT_Attributes_Character_Player",
				"/Game/Data/Gameplay/Attributes/CT_Attributes_Character_Enemy.CT_Attributes_Character_Enemy",
			],
		},
		"/Script/APCombatCoordinator": {
			"+GlobalCooldownChannels": [
				'(Id="Channel.1",Duration=10,NumConcurrent=1)',
				'(Id="Channel.2",Duration=10,NumConcurrent=1)',
			],
		},
		"/Script/APAbilitySystemGlobals": {
			GlobalAttackOverrideTableNames:
				"/Game/Data/Gameplay/Attacks/CT_Attacks_Defaults.CT_Attacks_Defaults",
			"+GlobalAttackOverrideTableNames": [
				"/Game/Data/Gameplay/Attacks/CT_Attacks_Player.CT_Attacks_Player",
				"/Game/Data/Gameplay/Attacks/CT_Attacks_Enemy.CT_Attacks_Enemy",
				"/Game/Data/Gameplay/Attacks/CT_Attacks_Boss.CT_Attacks_Boss",
			],
			bAIIgnoresCost: false,
			StaminaCostCheckMax: "1.0f",
			bPlayersUseStaminaCostCheckMax: false,
			bAIUseStaminaCostCheckMax: true,
			ExhaustionDuration: "0.0f",
		},
		"/Script/UnrealEd.ProjectPackagingSettings": {
			Build: "IfProjectHasCode",
			ApplocalPrerequisitesDirectory: '(Path="")',
			"+MapsToCook": [
				'(FilePath="/Game/Maps/Development/Server")',
				'(FilePath="/Game/Maps/Menu/Menu_Home")',
			],
			"-MapsToCook": [
				'(FilePath="/Game/Developers/place")',
				'(FilePath="/Game/Maps/Menu/Menu_Home")',
			],
			"+DirectoriesToAlwaysCook": [
				'(Path="Movies")',
				'(Path="Blueprints/Cues")',
			],
		},
	},
	expectC = `[/Script/APVersionConfig]
API_URL="https://example.com/"
API_DEBUG=False
GameLiftSecret="secret"
`,
	expectD = {
		"/Script/APVersionConfig": {
			API_DEBUG: "False",
			API_URL: '"https://example.com"',
			GameLiftSecret: '"secret"',
		},
	};

test("decode from DefaultGame.ini file", function (t) {
	var d = i.decode(data1, { isArray: false });
	t.deepEqual(d, expectB);
	t.end();
});

test("encode DefaultGame.ini from data. isArray=true", function (t) {
	var e = i.encode(i.decode(expectA), { isArray: false });
	t.deepEqual(e, expectA);
	t.end();
});

test("decode from DefaultVersionConfig.ini file", function (t) {
	var d = i.decode(data2, { stripQuotes: false, isArray: false });
	t.deepEqual(d, expectD);
	t.end();
});

test("encode from DefaultVersionConfig.ini file", function (t) {
	const d = i.decode(expectC, { stripQuotes: false, isArray: true });
	const e = i.encode(d, { unsafe: true, isArray: false });
	t.deepEqual(e, expectC);
	t.end();
});
