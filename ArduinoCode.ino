 int button1 = 4; /*set the button1 pin*/
 int button2 = 3; /*set the button2 pin*/

 int LED = 5;

int i = 0;
int quiz[5] = {-1,-1,-1,-1}; /* Define empty array of Questionnaire answers*/
int quizSize = 4; /* Define number of questions and LED lights*/
 
 void setup()
 {
    /* Set up Grove Dual Buttons */
   pinMode(button1,INPUT);
   pinMode(button2,INPUT);
   Serial.begin(9600);


 }
 
 void loop()
{
  /*   */
  for (i = 0; i < quizSize; ++i)
  {
    /* Reset button states */
    bool state1 = 1; /*set button1 state*/
    bool state2 = 1; /*set button2 state*/

    /*   */
    while(true)
    {
        /*Set up pins for the LED lights based on variable LED position*/
        pinMode(LED, OUTPUT);
        digitalWrite(LED, HIGH); // Turn ON LED

        // Detect what stat the buttons are pressed on
        state1 = digitalRead(button1);
        state2 = digitalRead(button2);

        /* If either button is presseed then a response is recorded.*/
        if (state1 == 0)
        {
          quiz[i] = 1; /* Save response to questionnaire*/
          digitalWrite(LED, LOW); /* LED turned off once question answered*/
          LED +=1; /* Move to the next LED position */
          break; /* Response done, end while loop */
        }
        if (state2 == 0)
        {
          quiz[i] = 2;
          digitalWrite(LED, LOW);
          LED +=1;
          break;
        }
    }
    
    /* Delay exists to ensure states don't repeat input in short period of time*/
    delay(2000);

  }
        /*   */
        for(int l = 0; l < quizSize; ++l) 
        {
          Serial.print(quiz[l]); /*   */
        }
       Serial.print("\n");
       LED -= quizSize; /*   */

 }
