const UserGuidePage: React.FC = () => {
  return (
    <div className="view-page-container">
      <h1>Naudotojo gidas</h1>
      <div className="flex gap-4 flex-col">
        <h3>
          Testas išmėginimui: mokinio ID "test", testo kodas "ABCD". Rezultatų
          pavyzdžiui: mokinio ID "10a14sraige", testo kodas "ABCD".
        </h3>
        <h3>
          Platformoje, apart mygtukų testo atsakymų pateikimui, niekur neraste
          mygtuko "Išsaugoti" - čia viskas išsaugoma realiu laiku. Tai, kas
          parašyta teksto laukelyje, jau iškart yra įrašyta ir į duombazę.
        </h3>
        <h1>Testo kūrimas</h1>
        <h3>
          Pasirinkite testo kodą - jo keisti nebus galima. Kodą sudaro tik
          didžiosios anglų kalbos abėcėlės raidės
        </h3>
        <img
          className="border-black border-2"
          src="/user-guide/2.png"
          alt="Naudotojo gidas"
        />
        <h3>
          Suveskite testo pavadinimą, aprašymą bei simbolius, kuriuos praverstų
          mokiniams galėti patogiai nusikopijuoti berašant testą.
        </h3>
        <img
          className="border-black border-2"
          src="/user-guide/3.png"
          alt="Naudotojo gidas"
        />
        <h3>
          Pildykite klausimus, atsakymus, rinkitės, ar klausimas papildomas,
          kiek taškų vertas (nuo 1 iki 9)... O svarbiausia, užduoties sąlygai
          (klausimui) galite įkelti ir paveiksliukus! Tam arba nutempkite
          paveiksliuko failą į teksto lauką, arba teksto laukelyje įklijuokite
          nukopijuotą paveikslėlį.
        </h3>
        <img
          className="border-black border-2"
          src="/user-guide/4.png"
          alt="Naudotojo gidas"
        />
        <h1>Testo redagavimas</h1>
        <h3>4 bendri mygtukai: REDAGUOTI, KOPIJUOTI, IŠTRINTI, VIEŠINTI.</h3>
        <h3>
          Paviešinus testo užduotys bus prieinamos bet kam, kas žinos to testo
          kodą. Užprivatinus testą užduotys bus prieinamos tik jį sukūrusiam
          mokytojui. Mokinių jau pateikti atsakymai bei mokytojo įvertinimai nuo
          testo užduočių viešumo nepriklauso (viskas išsisaugo).
        </h3>
        <h3>
          Testą galite redaguoti bet kuriuo momentu. Net, kai jis yra
          paviešintas
        </h3>
        <h3>Taip pat galite sukurti testo užduočių kopiją.</h3>
        <img
          className="border-black border-2"
          src="/user-guide/5.png"
          alt="Naudotojo gidas"
        />
        <img
          className="border-black border-2"
          src="/user-guide/9.png"
          alt="Naudotojo gidas"
        />
        <h1>Testo atlikimas</h1>
        <h3>
          Testas atliekamas mokiniui suvedus savo ID bei testo kodą. Mokinio ID
          bus skirtas mokytojui identifikuoti mokinį bei mokinys galės vėliau
          naudojantis tuo ID pasitikrinti rezultatus. Mokinio ID gali būti bet
          koks tekstas, tačiau netalpinkite jame jokių asmeninių duomenų, nes
          jie platformos administratoriaus nėra tvarkomi. T.y. nerašykite vardų,
          pavardžių, asmens kodų ir pnš.
        </h3>
        <h3>
          Mokinio ID formato rekomendacija: pvz.: "10a14sraige" - mokinys iš 10a
          klasės, yra 14-liktas klasės sąraše, naudoja slaptažodį "sraige"
          rezultatų pasitikrinimui (kad kiti mokiniai negalėtų lengvai nustatyti
          kitų mokinių ID).
        </h3>
        <img
          className="border-black border-2"
          src="/user-guide/13.png"
          alt="Naudotojo gidas"
        />
        <h3>
          Testas atliekamas viso ekrano rėžime. Mokiniui išėjus iš viso ekrano
          rėžimo (galimai su tikslu sukčiauti) mokytojas yra informuojamas
          "Testo valdymo" ekrane (lentelėje).
        </h3>
        <h3>
          Mokiniui paspaudus sibolio kopijavimo mygtuką simbolis nusikopijuoja.
          Norint jį panaudoti tesktiniame laukelyje, jį reikia įklijuoti (Ctrl +
          V).
        </h3>
        <h3>
          Suvesti atsakymai/sprendimai yra išsaugomi kompiuterio atmintyje
          (localStorage), siunčiami į duombazę tik paspaudus mygtuką "Pateikti
          vertinimui".
        </h3>
        <img
          className="border-black border-2"
          src="/user-guide/6.png"
          alt="Naudotojo gidas"
        />
        <h3>
          Grįžtamasis ryšys matomas mokytojui "Testo valdymo" ekrane, kuomet jis
          yra pateiktas.
        </h3>
        <img
          className="border-black border-2"
          src="/user-guide/7.png"
          alt="Naudotojo gidas"
        />
        <h3>
          "Testo valdymo" ekranas mokytojui pasiekiamas iš pagrindinio mokytojo
          aplinkos puslapio, paspaudus tiesiogiai ant testo kortelės (plataus
          pilko mygtuko).
        </h3>
        <h3>
          Kaip minėta anksčiau, "Testo valdymo" lange mokytojas mato testo
          vykdymo eigą - mokinių išėjimus iš viso ekrano rėžimo, pateiktus
          atsakymus, pateiktą grįžtamąjį ryšį.
        </h3>
        <h3>Taip pat, iš čia pasiekiamas testo vertinimas.</h3>
        <img
          className="border-black border-2"
          src="/user-guide/8.png"
          alt="Naudotojo gidas"
        />
        <h1>Vertinimas</h1>
        <h3>
          Vertinimas iš pat pradžių yra privatus - tik mokytojas jį gali
          pasiekti. Norint pasidalinti įvertinimu (arba tik pažymiu, arba ir
          užduočių atsakymais) su mokiniais, reikia paspausti atitikamus
          mygtukus viršuje dešinėje. Testo užduotys neprivalo būti paviešintos,
          kad rezultatai būtų matomi mokiniams, tačiau dalinantis atsakymais (ne
          tik pažymiais), galima pasidalinti ir testo užduotimis, mat, vertinime
          pateikiami tik atsakymai, o uždavinių sąlygos nepateikiamos.
        </h3>
        <h3>
          Vertinant darbus pateikiama kiekvienos užduoties sąlyga, mokinio
          pateiktas atsakymas bei Jūsų užsirašytas atsakymas (testo
          redagavime/kūrime).
        </h3>

        <img
          className="border-black border-2"
          src="/user-guide/10.png"
          alt="Naudotojo gidas"
        />
        <h3>Vertinate paspausdami taškų paskyrimo mygtukus.</h3>
        <img
          className="border-black border-2"
          src="/user-guide/11.png"
          alt="Naudotojo gidas"
        />
        <h3>
          Kiekvieno mokinio pateiktų atsakymų vertinimo pabaigoje yra
          automatiškai pateikiami taškai bei įvertinimas. Taip pat galima
          palikti mokiniui komentarą. Pažymiui apskaičiuoti naudojama formulė:
          taškai * 8 / maksimalūs taškai + 2. T.y. jei mokinys surinko 0 taškų,
          jo pažymys bus 2, jei surinko visus taškus, jo pažymys bus 10.
        </h3>
        <h3>
          Puslapio pabaigoje pateikiama rezultatų suvestinė. Lentelėje matoma
          kiekvieno mokinio ID, surinkti taškai, pažymys.
        </h3>
        <img
          className="border-black border-2"
          src="/user-guide/12.png"
          alt="Naudotojo gidas"
        />
        <h1>Rezultatų pasitikrinimas</h1>
        <h3>
          Mokytojui paskelbus įvertinimus (arba tik pažymius, arba ir
          atsakymus), mokiniai juos gali pasitikrinti labai panašiai, kaip
          atlieka testą. Suvedamas tas pats ID bei testo kodas. Testo užduotys
          neprivalo būti paviešintos, kad būtų galima matyti rezultatus. Kartais
          mokytojas gali paviešinti užduotis, kad galima būtų išanalizuoti
          klaidas.
        </h3>
        <img
          className="border-black border-2"
          src="/user-guide/13.png"
          alt="Naudotojo gidas"
        />
        <img
          className="border-black border-2"
          src="/user-guide/14.png"
          alt="Naudotojo gidas"
        />
        <img
          className="border-black border-2"
          src="/user-guide/15.png"
          alt="Naudotojo gidas"
        />
        <p>Norėdami sugrįžti tiesiog uždarykite šį skirtuką.</p>
      </div>
    </div>
  );
};

export default UserGuidePage;
