/ **
  * Énumération des servos
  * /
enum  eServos
{
    FL = 9 ,
    RL = 11 ,
    RR = 13 ,
    FR = 15 ,
    Mât = 0
}

/ **
  * Énumération des groupes d'asservissement
  * /
énumération  eServoGroup
{
    //% block = "roue"
    Roue ,
    //% block = "mât"
    Mât ,
    //% block = "tous"
    Tout
}

/ **
  * Énumération des directions gauche / droite
  * /
enum  eDirection
{
    //% block = "left"
    À gauche ,
    //% block = "right"
    Droit
}

/ **
  * Énumération des directions avant / arrière
  * /
enum  eVector
{
    //% block = "forward"
    En avant ,
    //% block = "reverse"
    Sens inverse
}

/ **
 * Unité Ping pour capteur
 * /
énumération  ePingUnit
{
    //% block = "cm"
    Centimètres ,
    //% block = "pouces"
    Pouces ,
    //% block = "μs"
    MicroSecondes
}

/ **
  * Dénombrement des moteurs.
  * /
énumération  eMotor
{
    //% block = "left"
    À gauche ,
    //% block = "right"
    Droite ,
    //% block = "les deux"
    Tous les deux
}

/ **
  * Modes d'arrêt. Côte ou frein
  * /
enum  eStopMode
{
    //% block = "pas de frein"
    Côte ,
    //% block = "frein"
    Frein
}

/ **
  * Mode de mise à jour pour les LED
  * Le réglage sur Manuel nécessite les blocs de changement de LED
  * le réglage sur Auto mettra à jour les LED à chaque fois qu'elles changent
  * /
enum  eUpdateMode
{
    Manuel ,
    Auto
}

/ **
  * Couleurs LED prédéfinies
  * /
enum  eColors
{
    //% block = rouge
    Rouge  =  0xff0000 ,
    //% block = orange
    Orange  =  0xffa500 ,
    //% block = jaune
    Jaune  =  0xffff00 ,
    //% block = vert
    Vert  =  0x00ff00 ,
    //% block = bleu
    Bleu  =  0x0000ff ,
    //% block = indigo
    Indigo  =  0x4b0082 ,
    //% block = violet
    Violet  =  0x8a2be2 ,
    //% block = violet
    Violet  =  0xff00ff ,
    //% block = blanc
    Blanc  =  0xffffff ,
    //% block = noir
    Noir  =  0x000000
}

/ **
  * Touches du clavier
  * /
ENUM  eKeys
{
    //% block = "stop"
    kStop = 0b0000000010000000 ,
    //% block = "forward"
    kForward = 0b0000010000000000 ,
    //% block = "reverse"
    kReverse = 0b0000000000010000 ,
    //% block = "avant gauche"
    kForwardLeft = 0b0000001000000000 ,
    //% block = "avant droit"
    kForwardRight = 0b0000100000000000 ,
    //% block = "inverser à gauche"
    kReverseLeft = 0b0000000000001000 ,
    //% block = "inverser à droite"
    kReverseRight = 0b0000000000100000 ,
    //% block = "tourner à gauche"
    kSpinLeft = 0b0000000001000000 ,
    //% block = "tourner à droite"
    kSpinRight = 0b0000000100000000 ,
    //% block = "mât gauche"
    kMastLeft = 0b1000000000000000 ,
    //% block = "mât droit"
    kMastRight = 0b0100000000000000 ,
    //% block = "cross"
    kCross = 0b0000000000000100 ,
    //% block = "tick"
    kTick = 0b0000000000000010 ,
    //% block = "pause"
    kPause = 0b0000000000000001 ,
    //% block = "enregistrer"
    kSave = 0b0010000000000000 ,
    //% block = "charger"
    kLoad = 0b0001000000000000
}

/ **
 * Blocs personnalisés
 * /

//% poids = 10 couleur = # e7660b icon = "\ uf135"
espace de noms  Rover
{
    laissez  PCA  =  0x40 ; 	// adresse i2c du servo-contrôleur 4tronix Animoid
    soit  EEROM  =  0x50 ; 	// adresse i2c d'EEROM
    laissez  initI2C  =  faux ;
    soit  SERVOS  =  0x06 ;  // première adresse d'asservissement pour l'octet de démarrage bas
    laissez  leftSpeed  =  0 ;
    laissez  rightSpeed  =  0 ;
    laissez  servoOffset : nombre [ ]  =  [ ] ;
    laissez  fireBand : Fireled . Bande ;
    laissez  _updateMode  =  eUpdateMode . Auto ;


// FONCTIONS D'AIDE

    fonction  pince ( valeur : nombre ,  min : nombre ,  max : nombre ) : nombre
    {
        retourne  Math . max ( Math . min ( max ,  valeur ) ,  min ) ;
    }

    // initialise le servomoteur et les valeurs du tableau de décalage
    fonction  initPCA ( ) : void
    {

        laissez  i2cData  =  broches . createBuffer ( 2 ) ;
        initI2C  =  vrai ;

        i2cData [ 0 ]  =  0 ; 		// Registre de mode 1
        i2cData [ 1 ]  =  0x10 ; 	// Mettre au lit
        épingles . i2cWriteBuffer ( PCA ,  i2cData ,  faux ) ;

        i2cData [ 0 ]  =  0xFE ; 	// Registre de pré-échelle
        i2cData [ 1 ]  =  101 ; 	// réglé sur 60 Hz
        épingles . i2cWriteBuffer ( PCA ,  i2cData ,  faux ) ;

        i2cData [ 0 ]  =  0 ; 		// Registre de mode 1
        i2cData [ 1 ]  =  0x81 ; 	// Se réveiller
        épingles . i2cWriteBuffer ( PCA ,  i2cData ,  faux ) ;

        pour  ( soit  servo = 0 ;  servo < 16 ;  servo ++ )
        {
            i2cData [ 0 ]  =  SERVOS  +  servo * 4  +  0 ; 	// Registre servo
            i2cData [ 1 ]  =  0x00 ; 			// début d'octet de poids faible - toujours 0
            épingles . i2cWriteBuffer ( PCA ,  i2cData ,  faux ) ;

            i2cData [ 0 ]  =  SERVOS  +  servo * 4  +  1 ; 	// Registre servo
            i2cData [ 1 ]  =  0x00 ; 			// début d'octet haut - toujours 0
            épingles . i2cWriteBuffer ( PCA ,  i2cData ,  faux ) ;
        }

	loadOffsets ( ) ;
    }

    // fréquence PWM lente pour des vitesses plus lentes pour améliorer le couple
    // une seule fréquence PWM disponible pour toutes les broches
    fonction  setPWM ( vitesse : nombre ) : vide
    {
        if  ( vitesse  <  200 )
            épingles . analogSetPeriod ( AnalogPin . P0 ,  60000 ) ;
        sinon  si  ( vitesse  <  300 )
            épingles . analogSetPeriod ( AnalogPin . P0 ,  40000 ) ;
        autre
            épingles . analogSetPeriod ( AnalogPin . P0 ,  30000 ) ;
    }


// BLOCS SERVO

    / **
      * Initialiser la roue / le mât / tous les servos à l'angle = 0
      * groupe de paramètres quel groupe de servos centrer
      * /
    //% blockId = "zeroServos"
    //% block = "Center% group | servos"
    //% poids = 100
    //% subcategory = Servos
     fonction d'  exportation zeroServos ( groupe : eServoGroup ) : void
    {
        commutateur ( groupe )
        {
            case  eServoGroup . Roue :
                setServo ( getServoNumber ( eServos . FL ) ,  0 ) ;
                setServo ( getServoNumber ( eServos . FR ) ,  0 ) ;
                setServo ( getServoNumber ( eServos . RL ) ,  0 ) ;
                setServo ( getServoNumber ( eServos . RR ) ,  0 ) ;
                pause ;
            case  eServoGroup . Mât :
                setServo ( getServoNumber ( eServos . Mast ) ,  0 ) ;
                pause ;
            par défaut :
                pour  ( soit  i = 0 ;  i < 16 ;  i ++ )
                    setServo ( i ,  0 ) ;
                pause ;
        }
    }

    / **
      * Dirigez toutes les roues à gauche ou à droite par angle
      * @param direction gauche ou droite
      * Angle d'angle @param pour diriger
      * /
    //% blockId = "e_steer"
    //% block = "direction% direction | par angle% angle"
    //% poids = 90
    //% subcategory = Servos
     fonction d'  exportation direction ( direction : eDirection ,  angle : nombre ) : vide
    { 
        angle  =  pince ( angle ,  0 ,  90 ) ;
        if  ( direction == eDirection . Gauche )
            angle  =  0 - angle ;
        setServo ( getServoNumber ( eServos . FL ) ,  angle ) ;
        setServo ( getServoNumber ( eServos . FR ) ,  angle ) ;
        setServo ( getServoNumber ( eServos . RL ) ,  0 - angle ) ;
        setServo ( getServoNumber ( eServos . RR ) ,  0 - angle ) ;
    }

    / **
      * Définir la position individuelle du servo par angle
      * @param servo Servo numéro (0 à 15)
      * @param angle degrés pour tourner le servo (-90 à +90)
      * /
    //% blockId = "setServo"
    //% block = "définir le servo% servo = e_servos | à l'angle% angle"
    //% poids = 80
    //% subcategory = Servos
     fonction d'  exportation setServo ( servo : nombre ,  angle : nombre ) : void
    {
        si  ( initI2C  ==  false )
        {
            initPCA ( ) ;
        }
        // deux octets doivent être définis pour les positions de démarrage et d'arrêt du servo
        // les servos démarrent à SERVOS (0x06) et sont alors des blocs consécutifs de 4 octets
        // la position de départ (toujours 0x00) est définie lors de l'initialisation pour tous les servos
        // le décalage zéro pour chaque servo est lu lors de l'initialisation dans le tableau servoOffset

        laissez  i2cData  =  broches . createBuffer ( 2 ) ;
        laissez  commencer  =  0 ;
        angle  =  pince ( angle ,  - 90 ,  90 ) ;
        laisser  butée  =  369  +  ( angle  +  servoOffset [ servo ] ) * 223 / 90 ;

        i2cData [ 0 ]  =  SERVOS  +  servo * 4  +  2 ; 	// Registre servo
        i2cData [ 1 ]  =  ( arrêter & 0xff ) ; 		// arrêt d'octet de poids faible
        épingles . i2cWriteBuffer ( PCA ,  i2cData ,  faux ) ;

        i2cData [ 0 ]  =  SERVOS  +  servo * 4  +  3 ; 	// Registre servo
        i2cData [ 1 ]  =  ( arrêt  >>  8 ) ; 		// arrêt d'octet haut
        épingles . i2cWriteBuffer ( PCA ,  i2cData ,  faux ) ;
    }

    / **
      * Renvoyer le numéro de servo du nom
      * @param value nom du servo
      * /
    //% blockId = "e_servos"
    //% block = "% valeur"
    //% poids = 70
    //% subcategory = Servos
     fonction d'  exportation getServoNumber ( valeur : eServos ) : nombre
    {
         valeur de retour ;
    }

    / **
      * Réglez le décalage du servo. N'enregistre pas dans EEROM
      * @param servo Servo numéro (0 à 15)
      * @param angle degrés pour tourner le servo (-90 à +90)
      * /
    //% blockId = "setOffset"
    //% block = "définir l'offset du servo% servo = e_servos | à% offset"
    //% poids = 60
    //% subcategory = Servos
     fonction d'  exportation setOffset ( servo : nombre ,  offset : nombre ) : void
    {
        servo  =  pince ( servo ,  0 ,  15 ) ;
        servoOffset [ servo ]  =  offset ;
    }

    / **
      * Obtenez le décalage de servo de la mémoire. Ne se charge pas depuis EEROM
      * @param servo Servo numéro (0 à 15)
      * /
    //% blockId = "getOffset"
    //% block = "obtenir l'offset du servo% servo = e_servos"
    //% poids = 55
    //% subcategory = Servos
     fonction d'  exportation getOffset ( servo : nombre ) : nombre
    {
        servo  =  pince ( servo ,  0 ,  15 ) ;
        return  servoOffset [ servo ] ;
    }

    / **
      * Effacer tous les décalages de servo (ne sauvegarde pas dans EEROM)
      * /
    //% blockId = "clearOffsets"
    //% block = "effacer tous les décalages servo"
    //% poids = 50
    //% subcategory = Servos
     fonction d'  exportation clearOffsets ( ) : void
    {
        pour  ( soit  i = 0 ;  i < 16 ;  i ++ )
            servoOffset [ i ]  =  0 ;
    }

// BLOCS MOTEUR

    / **
      * Avancez (ou reculez) à la vitesse sélectionnée
      * @param direction sélectionnez avant ou arrière
      * @param speed speed du moteur entre 0 et 100. ex: 60
      * /
    //% blockId = "e_move"
    //% block = "move% direction | at speed% speed"
    //% speed.min = 0 speed.max = 100
    //% poids = 100
    //% subcategory = Moteurs
     déplacement de la fonction d'  exportation ( direction : eVector , vitesse : nombre ) : vide 
    {
        vitesse  =  pince ( vitesse ,  0 ,  100 ) ;
        moteur ( eMotor . Les deux ,  direction ,  vitesse ) ;
    }

    / **
      * Avancez (ou reculez) à la vitesse sélectionnée pendant des millisecondes
      * @param direction sélectionnez avant ou arrière
      * @param speed speed du moteur entre 0 et 100. ex: 60
      * @param millis durée en millisecondes pour se déplacer, puis s'arrêter. par exemple: 400
      * /
    //% blockId = "e_move_milli"
    //% block = "move% direction | at speed% speed | for% millis | (ms)"
    //% speed.min = 0 speed.max = 100
    //% poids = 90
    //% subcategory = Moteurs
     fonction d'  exportation move_milli ( direction : eVector ,  vitesse : nombre ,  millis : nombre ) : void
    {
        vitesse  =  pince ( vitesse ,  0 ,  100 ) ;
        moteur ( eMotor . Les deux ,  direction ,  vitesse ) ;
        basique . pause ( millis ) ;
        stop ( eStopMode . Côte ) ;
    }

    / **
      * Arrêtez le rover en roulant lentement jusqu'à l'arrêt ou en freinant
      * Mode @param Freins activés ou désactivés
      * /
    //% blockId = "rover_stop" block = "arrêter avec% mode"
    //% poids = 80
    //% subcategory = Moteurs
     arrêt de la fonction d'  exportation ( mode : eStopMode ) : void
    {
        laissez  stopMode  =  0 ;
        if  ( mode  ==  eStopMode . Frein )
            stopMode  =  1 ;
        épingles . digitalWritePin ( DigitalPin . P1 ,  stopMode ) ;
        épingles . digitalWritePin ( DigitalPin . P12 ,  stopMode ) ;
        épingles . digitalWritePin ( DigitalPin . P8 ,  stopMode ) ;
        épingles . digitalWritePin ( DigitalPin . P0 ,  stopMode ) ;
    }

    / **
      * Faire avancer ou reculer les moteurs.
      * Moteur @param moteur à conduire.
      * @param direction sélectionnez avant ou arrière
      * @param vitesse vitesse du moteur par exemple: 60
      * /
    //% blockId = "moteur"
    //% block = "entraînement% moteur | moteurs% direction | à vitesse% vitesse"
    //% poids = 70
    //% speed.min = 0 speed.max = 100
    //% subcategory = Moteurs
     moteur de la fonction d'  exportation ( moteur : eMotor , direction : eVector , vitesse : nombre ) : vide  
    {
        vitesse  =  pince ( vitesse ,  0 ,  100 ) * 10,23 ;
        soit  speed0  =  0 ;
        soit  speed1  =  0 ;
        setPWM ( vitesse ) ;
        if  ( direction  ==  eVector . Avant )
        {
            speed0  =  vitesse ;
            vitesse1  =  0 ;
        }
        else  // doit être inversé
        {
            speed0  =  0 ;
            speed1  =  vitesse ;
        }
        if  ( ( moteur  ==  eMotor . Gauche )  ||  ( moteur  ==  eMotor . Both ) )
        {
            épingles . analogWritePin ( AnalogPin . P1 ,  speed0 ) ;
            épingles . analogWritePin ( AnalogPin . P12 ,  vitesse1 ) ;
        }

        if  ( ( moteur  ==  eMotor . Droite )  ||  ( moteur  ==  eMotor . Both ) )
        {
            épingles . analogWritePin ( AnalogPin . P8 ,  speed0 ) ;
            épingles . analogWritePin ( AnalogPin . P0 ,  vitesse1 ) ;
        }
    }


    / **
      * Tournez à gauche ou à droite à la vitesse
      * @param direction gauche ou droite
      * @param speed de 0 à 100. ex: 60
      * /
    //% blockId = "e_spin"
    //% block = "spin% direction | at speed% speed"
    //% poids = 85
    //% subcategory = Moteurs
     fonction d'  exportation spin ( direction : eDirection ,  vitesse : nombre ) : vide
    { 
        vitesse  =  pince ( vitesse ,  0 ,  100 ) ;
        setServo ( getServoNumber ( eServos . FL ) ,  45 ) ;
        setServo ( getServoNumber ( eServos . FR ) ,  - 45 ) ;
        setServo ( getServoNumber ( eServos . RL ) ,  - 45 ) ;
        setServo ( getServoNumber ( eServos . RR ) ,  45 ) ;
        if  ( direction == eDirection . Gauche )
        {
            moteur ( eMotor . Gauche ,  eVector . Marche arrière ,  vitesse ) ;
            moteur ( eMotor . Droite ,  eVector . Avant ,  vitesse ) ;
        }
        autre
        {
            moteur ( eMotor . Gauche ,  eVector . Avant ,  vitesse ) ;
            moteur ( eMotor . Droite ,  eVector . Marche arrière ,  vitesse ) ;
        }
    }

// BLOCS CAPTEURS
    / **
    * Lire la distance du module sondeur
    *
    * @param unit unité de conversion souhaitée
    * /
    //% blockId = "readSonar"
    //% block = "lire le sondeur en tant que% unit"
    //% poids = 100
    //% subcategory = Capteurs
     fonction d'  exportation readSonar ( unité : ePingUnit ) : nombre
    {
        // envoyer l'impulsion
        laissez  trig  =  DigitalPin . P13 ;
        laissez  echo  =  DigitalPin . P13 ;
        soit  maxCmDistance  =  500 ;
        soit  d = 10 ;
        épingles . setPull ( trig ,  PinPullMode . PullNone ) ;
        pour  ( soit  x = 0 ;  x < 10 ;  x ++ )
        {
            épingles . digitalWritePin ( trig ,  0 ) ;
            contrôle . waitMicros ( 2 ) ;
            épingles . digitalWritePin ( trig ,  1 ) ;
            contrôle . waitMicros ( 10 ) ;
            épingles . digitalWritePin ( trig ,  0 ) ;
            // lire l'impulsion
            d  =  broches . pulseIn ( écho ,  PulseValue . High ,  maxCmDistance * 58 ) ;
            si  ( d > 0 )
                pause ;
        }
        interrupteur  ( unité )
        {
            case  ePingUnit . Centimètres : retourne  Math . rond ( d / 58 ) ;
            case  ePingUnit . Pouces : retourne  Math . rond ( d / 148 ) ;
            par défaut : return  d ;
        }
    }


// BLOCS EEROM

    / **
      * Ecrire un octet de données dans EEROM à l'adresse sélectionnée
      * @param address Emplacement dans EEROM pour écrire
      * @param data Octet de données à écrire
      * /
    //% blockId = "writeEEROM"
    //% block = "écrire% data | à l'adresse% adresse"
    //% data.min = -128 data.max = 127
    //% poids = 100
    //% subcategory = EEROM
     fonction d'  exportation writeEEROM ( données : numéro ,  adresse : numéro ) : void
    {
        wrEEROM ( données ,  adresse  +  16 ) ;
    }

    // Utilise les 16 derniers octets d'EEROM pour les décalages de servo. Aucun accès utilisateur
    fonction  wrEEROM ( données : numéro ,  adresse : numéro ) : void
    {
        laissez  i2cData  =  broches . createBuffer ( 3 ) ;

        i2cData [ 0 ]  =  adresse  >>  8 ; 	// adresse MSB
        i2cData [ 1 ]  =  adresse & 0xff ; 	// adresse LSB
        i2cData [ 2 ]  =  données & 0xff ;
        épingles . i2cWriteBuffer ( EEROM ,  i2cData ,  false ) ;
        basique . pause ( 1 ) ; 			// a besoin d'une courte pause. << 1ms ok?
    }

    / **
      * Lire un octet de données depuis EEROM à l'adresse sélectionnée
      * @param address Emplacement dans EEROM à lire
      * /
    //% blockId = "readEEROM"
    //% block = "lire l'adresse EEROM% adresse"
    //% poids = 90
    //% subcategory = EEROM
     fonction d'  exportation readEEROM ( adresse : numéro ) : numéro
    {
        return  rdEEROM ( adresse  +  16 ) ;
    }

    // Utilise les 16 derniers octets d'EEROM pour les décalages de servo. Aucun accès utilisateur
    fonction  rdEEROM ( adresse : numéro ) : numéro
    {
        laissez  i2cRead  =  broches . createBuffer ( 2 ) ;

        i2cRead [ 0 ]  =  adresse  >>  8 ; 	// adresse MSB
        i2cRead [ 1 ]  =  adresse & 0xff ; 	// adresse LSB
        épingles . i2cWriteBuffer ( EEROM ,  i2cRead ,  faux ) ;
        basique . pause ( 1 ) ;
         broches de retour . i2cReadNumber ( EEROM ,  NumberFormat . Int8LE ) ;
    }

    / **
      * Chargez les décalages de servo depuis EEROM
      * /
    //% blockId = "loadOffsets"
    //% block = "Charger les décalages de servo depuis EEROM"
    //% poids = 80
    //% subcategory = EEROM
     fonction d'  exportation loadOffsets ( ) : void
    {
	pour  ( soit  i = 0 ;  i < 16 ;  i ++ )
            servoOffset [ i ]  =  rdEEROM ( i ) ;
    }

    / **
      * Enregistrer les décalages de servo dans EEROM
      * /
    //% blockId = "saveOffsets"
    //% block = "Enregistrer les décalages servo dans EEROM"
    //% poids = 70
    //% subcategory = EEROM
     fonction d'  exportation saveOffsets ( ) : void
    {
	pour  ( soit  i = 0 ;  i < 16 ;  i ++ )
            wrEEROM ( servoOffset [ i ] , i ) ;
    }


// Blocs d'état FireLed

    // crée une bande FireLed si ce n'est déjà fait. Valeur par défaut de la luminosité 40
     feu de fonction ( ) : déclenché . Bande
    {
        si  ( ! fireBand )
        {
            fireBand  =  feu . newBand ( DigitalPin . P2 ,  4 ) ;
            fireBand . setBrightness ( 40 ) ;
        }
        return  fireBand ;
    }

    // met à jour les FireLeds si _updateMode est défini sur Auto
    fonction  updateLEDs ( ) : void
    {
        if  ( _updateMode  ==  eUpdateMode . Auto )
            feu ( ) . updateBand ( ) ;
    }

    / **
      * Règle toutes les LED sur une couleur donnée (plage de 0 à 255 pour r, g, b).
      * @param rgb couleur RVB de la LED
      * /
    //% blockId = "SetLedColor" block = "définit toutes les LED sur% rgb = e_colours"
    //% poids = 100
    //% subcategory = FireLeds
    //% blockGap = 8
     fonction d'  exportation setLedColor ( rgb : nombre )
    {
        feu ( ) . setBand ( rgb ) ;
        updateLEDs ( ) ;
    }

    / **
      * Effacez toutes les LED.
      * /
    //% blockId = "LedClear" block = "effacer toutes les LED"
    //% poids = 90
    //% subcategory = FireLeds
    //% blockGap = 8
     fonction d'  exportation ledClear ( ) : void
    {
        feu ( ) . clearBand ( ) ;
        updateLEDs ( ) ;
    }

    / **
     * Réglez une seule LED sur une couleur donnée (plage de 0 à 255 pour r, g, b).
     *
     * @param ledId position de la LED (0 à 3)
     * @param rgb couleur RVB de la LED
     * /
    //% blockId = "SetPixelColor" block = "définit la LED sur% ledId | to% rgb = e_colours"
    //% poids = 80
    //% subcategory = FireLeds
    //% blockGap = 8
     fonction d'  exportation setPixelColor ( ledId : number ,  rgb : number ) : void
    {
        ledId  =  pince ( ledId ,  0 ,  3 ) ;
        feu ( ) . setPixel ( ledId ,  rgb ) ;
        updateLEDs ( ) ;
    }

    / **
     * Réglez la luminosité des LED
     * @param luminosité une mesure de la luminosité de la LED entre 0 et 255. par exemple: 40
     * /
    //% blockId = "LedBrightness" block = "régler la luminosité de la LED% luminosité"
    //% luminosité.min = 0 luminosité.max = 255
    //% poids = 70
    //% subcategory = FireLeds
    //% blockGap = 8
     fonction d'  exportation led Luminosité ( luminosité : nombre ) : vide
    {
        feu ( ) . setBrightness ( luminosité ) ;
        updateLEDs ( ) ;
    }

    / **
      * Affiche un motif arc-en-ciel sur toutes les LED.
      * /
    //% blockId = "LedRainbow" block = "set LED rainbow"
    //% poids = 60
    //% subcategory = FireLeds
    //% blockGap = 8
     fonction d'  exportation ledRainbow ( ) : void
    {
        feu ( ) . setRainbow ( ) ;
        LED de mise à jour ( )
    }

    / **
      * Obtenez la valeur numérique de la couleur
      * @param color Couleurs LED RVB standard par exemple: # ff0000
      * /
    //% blockId = "e_colours" block =% color
    //% blockHidden = false
    //% poids = 50
    //% subcategory = FireLeds
    //% blockGap = 8
    //% shim = TD_ID colorSecondary = "# e7660b"
    //% color.fieldEditor = "numéro de couleur"
    //% color.fieldOptions.decompileLiterals = true
    //% color.defl = '# ff0000'
    //% color.fieldOptions.colours = '["# FF0000", "# 659900", "# 18E600", "# 80FF00", "# 00FF00", "# FF8000", "# D82600", "# B24C00" , "# 00FFC0", "# 00FF80", "# FFC000", "# FF0080", "# FF00FF", "# B09EFF", "# 00FFFF", "# FFFF00", "# 8000FF", "# 0080FF" , "# 0000FF", "# FFFFFF", "# FF8080", "# 80FF80", "# 40C0FF", "# 999999", "# 000000"] '
    //% color.fieldOptions.columns = 5
    //% color.fieldOptions.className = 'rgbColorPicker'
     fonction d'  exportation eColours ( couleur : nombre ) : nombre
    {
         couleur de retour ;
    }

    / **
      * Convertir des valeurs RVB en numéro de couleur
      *
      * @param red Valeur rouge de la LED (0 à 255)
      * @param green Valeur verte de la LED (0 à 255)
      * @param blue Valeur bleue de la LED (0 à 255)
      * /
    //% blockId = "convertRGB"
    //% block = "convertir du rouge% rouge | vert% vert | bleu% bleu"
    //% poids = 40
    //% subcategory = FireLeds
     fonction d'  exportation convertRGB ( r : nombre ,  g : nombre ,  b : nombre ) : nombre
    {
        return  ( ( r & 0xFF )  <<  16 ) | ( ( g & 0xFF )  <<  8 ) | ( b & 0xFF ) ;
    }

// Blocs de clavier

    / **
      * Obtenir la valeur numérique de la clé
      *
      * @param key nom de la clé
      * /
    //% blockId = "e_keyValue"
    //% block =% keyName
    //% poids = 50
    //% subcategory = Clavier
     fonction d'  exportation eKeyValue ( keyName : eKeys ) : nombre
    {
        return  keyName ;
    }

    / **
      * Attendez la pression de la touche
      *
      * /
    //% blockId = "e_waitForKey"
    //% block = "obtenir une pression sur la touche"
    //% poids = 100
    //% subcategory = Clavier
     fonction d'  exportation eWaitKey ( ) : nombre
    {
        laissez le  clavier  =  0 ;
        soit  compter  =  0 ;
        while  ( clavier  ==  0 )  // réessayer si zéro donnée - bit d'un hack
        {
            épingles . digitalWritePin ( DigitalPin . P16 ,  1 ) ;  // régler l'horloge au niveau haut
            while  ( pins . digitalReadPin ( DigitalPin . P15 )  ==  1 )  // attend que SDO passe à l'état bas
            {
                compter  + =  1 ;
                si  ( compte  >  1000 )
                {
                    compte  =  0 ;
                    basique . pause ( 1 )
                }
            }
            // while (pins.digitalReadPin (DigitalPin.P15) == 0) // attend que SDO redevienne haut
            //;
            //control.waitMicros(10);
            pour  ( soit  index  =  0 ;  index <= 15 ;  index ++ )
            {
                épingles . digitalWritePin ( DigitalPin . P16 ,  0 )  // régler l'horloge Low
                contrôle . attendreMicros ( 2 )
                clavier  =  ( clavier  <<  1 )  +  broches . digitalReadPin ( DigitalPin . P15 )  // lire les données
                épingles . digitalWritePin ( DigitalPin . P16 ,  1 )  // régler à nouveau l'horloge High
                contrôle . attendreMicros ( 2 )
            }
            clavier  =  65535  -  clavier
        }
        retour du  clavier ;
    }

}
