### Collections

```
test> use etpir-default
switched to db etpir-default
etpir-default> db.getCollectionNames()
[
  'beacons',
  'links',
  'secure_connection',
  'hosts',
  'script',
  'uri_redirects',
  'localStorage',
  'uri_refs',
  'cookies',
  'browsing_history'
]
etpir-default> 
```

each collection come from `inspection.json` file produced by WeC, plus:

* the path where the source come from
* a unique ID for every website+mode+day that identify the test
* the ISODateTime of the test
* the country it refers about.

### Example (from the Beacon collection, which is the most juicy)

```
etpir-default> db.beacons.find(0)
[
  {
    _id: ObjectId("633cc585d77e7c3c65694979"),
    id: '2ab4f2d8b66a9a48654fbe9269d58858be4db17f',
    evidence: 'output/banner0/2022-10-04/abm.madeira.gov.pt/inspection.json',
    country: 'portugal',
    when: '2022-10-04T23:45:09.805Z',
    beacons: [
      {
        filter: '.google-analytics.com/',
        listName: 'easyprivacy.txt',
        query: {
          _gid: 1275634958.1664927,
          _r: 1,
          _s: 1,
          _slc: 1,
          _u: 'IEBAAEABAAAAACAAI~',
          _v: 'j98',
          a: 263715972,
          cid: 38366286.16649263,
          de: 'UTF-8',
          dl: 'https://abm.madeira.gov.pt/',
          dt: 'ABM – Direção Regional do Arquivo e Biblioteca da Madeira',
          gjid: 2021898246,
          je: 0,
          jid: 1955903358,
          sd: '24-bit',
          sr: '1680x927',
          t: 'pageview',
          tid: 'UA-80272218-1',
          ul: 'en-us',
          v: 1,
          vp: '1680x927',
          z: 2119033300
        },
        url: 'https://www.google-analytics.com/j/collect?v=1&_v=j98&a=263715972&t=pageview&_s=1&dl=https%3A%2F%2Fabm.madeira.gov.pt%2F&ul=en-us&de=UTF-8&dt=ABM%20%E2%80%93%20Dire%C3%A7%C3%A3o%20Regional%20do%20Arquivo%20e%20Biblioteca%20da%20Madeira&sd=24-bit&sr=1680x927&vp=1680x927&je=0&_u=IEBAAEABAAAAACAAI~&jid=1955903358&gjid=2021898246&cid=38366286.1664926318&tid=UA-80272218-1&_gid=1275634958.1664926318&_r=1&_slc=1&z=2119033300',
        log: {
          stack: [
            {
              fileName: 'https://abm.madeira.gov.pt/',
              source: 'requested from https://abm.madeira.gov.pt/ and matched with easyprivacy.txt filter .google-analytics.com/'
            }
          ],
          timestamp: '2022-10-04T23:31:57.943Z'
        },
        occurrances: 1
      },
      {
        filter: '.google-analytics.com/',
        listName: 'easyprivacy.txt',
        query: null,
        url: 'https://www.google-analytics.com/analytics.js',
        log: {
          stack: [
            {
              fileName: 'https://abm.madeira.gov.pt/',
              source: 'requested from https://abm.madeira.gov.pt/ and matched with easyprivacy.txt filter .google-analytics.com/'
            }
          ],
          timestamp: '2022-10-04T23:31:57.436Z'
        },
        occurrances: 1
      }
    ]
  },
  {
    _id: ObjectId("633cc591ff6b33013ac3003c"),
    id: 'ed5faa4e74930ee9f45ec3f572aee7f26bb4d52d',
    evidence: 'output/banner0/2022-10-04/agc.sg.mai.gov.pt/inspection.json',
    country: 'portugal',
    when: '2022-10-04T23:45:21.882Z',
    beacons: [
      {
        filter: '.google-analytics.com/',
        listName: 'easyprivacy.txt',
        query: {
          _gid: 875957889.1664927,
          _r: 1,
          _s: 1,
          _u: 'YEBAAUABAAAAACAAI~',
          _v: 'j98',
          a: 713146857,
          cid: 1792767409.1664927,
          de: 'UTF-8',
          dl: 'https://agc.sg.mai.gov.pt/',
          dt: 'Bem-vindo - Secretaria-Geral do Ministério da Administração Interna - Archeevo',
          gjid: 68116562,
          gtm: '2oua30',
          je: 0,
          jid: 130890299,
          sd: '24-bit',
          sr: '1680x927',
          t: 'pageview',
          tid: 'UA-39394741-25',
          ul: 'en-us',
          v: 1,
          vp: '1680x927',
          z: 1305983565
        },
        url: 'https://www.google-analytics.com/j/collect?v=1&_v=j98&a=713146857&t=pageview&_s=1&dl=https%3A%2F%2Fagc.sg.mai.gov.pt%2F&ul=en-us&de=UTF-8&dt=Bem-vindo%20-%20Secretaria-Geral%20do%20Minist%C3%A9rio%20da%20Administra%C3%A7%C3%A3o%20Interna%20-%20Archeevo&sd=24-bit&sr=1680x927&vp=1680x927&je=0&_u=YEBAAUABAAAAACAAI~&jid=130890299&gjid=68116562&cid=1792767409.1664926480&tid=UA-39394741-25&_gid=875957889.1664926480&_r=1&gtm=2oua30&z=1305983565',
        log: {
          stack: [
            {
              fileName: 'https://agc.sg.mai.gov.pt/',
              source: 'requested from https://agc.sg.mai.gov.pt/ and matched with easyprivacy.txt filter .google-analytics.com/'
            }
          ],
          timestamp: '2022-10-04T23:34:39.877Z'
        },
        occurrances: 1
      },
      {
        filter: '.google-analytics.com/',
        listName: 'easyprivacy.txt',
        query: null,
        url: 'https://www.google-analytics.com/analytics.js',
        log: {
          stack: [
            {
              fileName: 'https://agc.sg.mai.gov.pt/',
              source: 'requested from https://agc.sg.mai.gov.pt/ and matched with easyprivacy.txt filter .google-analytics.com/'
            }
          ],
          timestamp: '2022-10-04T23:34:38.940Z'
        },
        occurrances: 1
      },
      {
        filter: '||googletagmanager.com^',
        listName: 'easyprivacy.txt',
        query: { id: 'UA-39394741-25' },
        url: 'https://www.googletagmanager.com/gtag/js?id=UA-39394741-25',
        log: {
          stack: [
            {
              fileName: 'https://agc.sg.mai.gov.pt/',
              source: 'requested from https://agc.sg.mai.gov.pt/ and matched with easyprivacy.txt filter ||googletagmanager.com^'
            }
          ],
          timestamp: '2022-10-04T23:34:34.640Z'
        },
        occurrances: 1
      },
      {
        filter: '.cookiecuttr.',
        listName: 'fanboy-annoyance.txt',
        query: null,
        url: 'https://agc.sg.mai.gov.pt/_js/jquery.cookiecuttr.js',
        log: {
          stack: [
            {
              fileName: 'https://agc.sg.mai.gov.pt/',
              source: 'requested from https://agc.sg.mai.gov.pt/ and matched with fanboy-annoyance.txt filter .cookiecuttr.'
            }
          ],
          timestamp: '2022-10-04T23:34:34.638Z'
        },
        occurrances: 1
      },
      {
        filter: '/cookiecuttr.',
        listName: 'fanboy-annoyance.txt',
        query: null,
        url: 'https://agc.sg.mai.gov.pt/_css/cookiecuttr.css',
        log: {
          stack: [
            {
              fileName: 'https://agc.sg.mai.gov.pt/',
              source: 'requested from https://agc.sg.mai.gov.pt/ and matched with fanboy-annoyance.txt filter /cookiecuttr.'
            }
          ],
          timestamp: '2022-10-04T23:34:34.636Z'
        },
        occurrances: 1
      }
    ]
  },
  {
    _id: ObjectId("633cc597eeb99016dcaa3a97"),
    id: 'f3051f5fa0a59ee86df3ea652c3419d187664f40',
    evidence: 'output/banner0/2022-10-04/anoeuropeujuventude.ipdj.gov.pt/inspection.json',
    country: 'portugal',
    when: '2022-10-04T23:45:27.195Z',
    beacons: [
      {
        filter: '||youtube.com/api/stats/qoe?',
        listName: 'easyprivacy.txt',
        query: {
          afmt: 251,
          bat: '10.001:0.29:1',
          bh: '10.001:17.000',
          bwe: '10.001:738764',
          bwm: '10.001:2148246:1.346',
          c: 'WEB_EMBEDDED_PLAYER',
          cbr: 'Chrome',
          cbrver: '93.0.4577.0',
          cl: 478376401,
          cmt: '2.489:0.796,10.001:8.308',
          cos: 'X11',
          cplatform: 'DESKTOP',
          cplayer: 'UNIPLAYER',
          cpn: 'PuzmoKP5DeMAndks',
          cver: '1.20221002.00.00',
          docid: '02oNDLYDJPY',
          ei: 'M8M8Y9aVM4u6W73hl4AO',
          el: 'embedded',
          event: 'streamingstats',
          fexp: '23983296,24001373,24002022,24002025,24004644,24007246,24080738,24135310,24135692,24169501,24171248,24197275,24219382,24226335,24248385,24255165,24276632,24277989,24278546,24283280,24289901,24289930,24290131,24297611,24298641,24298652,39322399',
          fmt: 248,
          ns: 'yt',
          plid: 'AAXqPemOPyFiFog4',
          referrer: 'https://www.youtube.com/embed/02oNDLYDJPY?version=3&autoplay=1&cc_load_policy=3&color=white&controls=0&loop=1&mute=1&rel=0&modestbranding=1&enablejsapi=1&playlist=02oNDLYDJPY&vq=hd1080',
          seq: 3,
          vps: '10.001:PL'
        },
        url: 'https://www.youtube.com/api/stats/qoe?fmt=248&afmt=251&cpn=PuzmoKP5DeMAndks&el=embedded&ns=yt&fexp=23983296%2C24001373%2C24002022%2C24002025%2C24004644%2C24007246%2C24080738%2C24135310%2C24135692%2C24169501%2C24171248%2C24197275%2C24219382%2C24226335%2C24248385%2C24255165%2C24276632%2C24277989%2C24278546%2C24283280%2C24289901%2C24289930%2C24290131%2C24297611%2C24298641%2C24298652%2C39322399&cl=478376401&seq=3&docid=02oNDLYDJPY&ei=M8M8Y9aVM4u6W73hl4AO&event=streamingstats&plid=AAXqPemOPyFiFog4&referrer=https%3A%2F%2Fwww.youtube.com%2Fembed%2F02oNDLYDJPY%3Fversion%3D3%26autoplay%3D1%26cc_load_policy%3D3%26color%3Dwhite%26controls%3D0%26loop%3D1%26mute%3D1%26rel%3D0%26modestbranding%3D1%26enablejsapi%3D1%26playlist%3D02oNDLYDJPY%26vq%3Dhd1080&cbr=Chrome&cbrver=93.0.4577.0&c=WEB_EMBEDDED_PLAYER&cver=1.20221002.00.00&cplayer=UNIPLAYER&cos=X11&cplatform=DESKTOP&cmt=2.489:0.796,10.001:8.308&vps=10.001:PL&bwm=10.001:2148246:1.346&bwe=10.001:738764&bat=10.001:0.29:1&bh=10.001:17.000',
        log: {
          stack: [
            {
              fileName: 'https://www.youtube.com/embed/02oNDLYDJPY?version=3&autoplay=1&cc_load_policy=3&color=white&controls=0&loop=1&mute=1&rel=0&modestbranding=1&enablejsapi=1&playlist=02oNDLYDJPY&vq=hd1080',
              source: 'requested from https://www.youtube.com/embed/02oNDLYDJPY?version=3&autoplay=1&cc_load_policy=3&color=white&controls=0&loop=1&mute=1&rel=0&modestbranding=1&enablejsapi=1&playlist=02oNDLYDJPY&vq=hd1080 and matched with easyprivacy.txt filter ||youtube.com/api/stats/qoe?'
            }
          ],
          timestamp: '2022-10-04T23:35:26.812Z'
        },
        occurrances: 6
      },
      {
        filter: '/v1/log_event',
        listName: 'easyprivacy.txt',
        query: { alt: 'json', key: 'AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8' },
        url: 'https://www.youtube.com/youtubei/v1/log_event?alt=json&key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8',
        log: {
          stack: [
            {
              fileName: 'https://www.youtube.com/embed/02oNDLYDJPY?version=3&autoplay=1&cc_load_policy=3&color=white&controls=0&loop=1&mute=1&rel=0&modestbranding=1&enablejsapi=1&playlist=02oNDLYDJPY&vq=hd1080',
              source: 'requested from https://www.youtube.com/embed/02oNDLYDJPY?version=3&autoplay=1&cc_load_policy=3&color=white&controls=0&loop=1&mute=1&rel=0&modestbranding=1&enablejsapi=1&playlist=02oNDLYDJPY&vq=hd1080 and matched with easyprivacy.txt filter /v1/log_event'
            }
          ],
          timestamp: '2022-10-04T23:35:24.553Z'
        },
        occurrances: 5
      },
      {
        filter: '$ping,third-party',
        listName: 'easyprivacy.txt',
        query: {
          _p: 305518281,
          _s: 3,
          _z: 'ccd.v9B',
          cid: 1769429040.1664927,
          dl: 'https://anoeuropeujuventude.ipdj.gov.pt/',
          dt: 'Ano Europeu da Juventude',
          gtm: '2oea30',
          sct: 1,
          seg: 0,
          sid: 1664926512,
          sr: '1680x927',
          tid: 'G-38EJX5QSL7',
          uaa: '',
          uab: '',
          uafvl: '',
          uam: '',
          uamb: 0,
          uap: '',
          uapv: '',
          uaw: 0,
          ul: 'en-us',
          v: 2
        },
        url: 'https://region1.google-analytics.com/g/collect?v=2&tid=G-38EJX5QSL7&gtm=2oea30&_p=305518281&cid=1769429040.1664926512&ul=en-us&sr=1680x927&uaa=&uab=&uafvl=&uamb=0&uam=&uap=&uapv=&uaw=0&_z=ccd.v9B&sid=1664926512&sct=1&seg=0&dl=https%3A%2F%2Fanoeuropeujuventude.ipdj.gov.pt%2F&dt=Ano%20Europeu%20da%20Juventude&_s=3',
        log: {
          stack: [
            {
              fileName: 'https://anoeuropeujuventude.ipdj.gov.pt/',
              source: 'requested from https://anoeuropeujuventude.ipdj.gov.pt/ and matched with easyprivacy.txt filter $ping,third-party'
            }
          ],
          timestamp: '2022-10-04T23:35:24.550Z'
        },
        occurrances: 3
      },
      {
        filter: '||youtube.com/api/stats/delayplay?',
        listName: 'easyprivacy.txt',
        query: {
          afmt: 251,
          autoplay: 1,
          c: 'WEB_EMBEDDED_PLAYER',
          cbr: 'Chrome',
          cbrver: '93.0.4577.0',
          cl: 478376401,
          cmt: 4.152,
          cos: 'X11',
          cplatform: 'DESKTOP',
          cplayer: 'UNIPLAYER',
          cpn: 'PuzmoKP5DeMAndks',
          cr: 'PT',
          cver: '1.20221002.00.00',
          delay: 4,
          docid: '02oNDLYDJPY',
          ei: 'M8M8Y9aVM4u6W73hl4AO',
          el: 'embedded',
          epm: 1,
          euri: 'https://anoeuropeujuventude.ipdj.gov.pt/',
          fexp: '23983296,24001373,24002022,24002025,24004644,24007246,24080738,24135310,24135692,24169501,24171248,24197275,24219382,24226335,24248385,24255165,24276632,24277989,24278546,24283280,24289901,24289930,24290131,24297611,24298641,24298652,39322399',
          fmt: 248,
          fs: 0,
          hl: 'en_US',
          inview: 0,
          lact: 5910,
          len: 17.021,
          list: 'TLGG10CrglXoWGMwNDEwMjAyMg',
          mos: 1,
          muted: 1,
          ns: 'yt',
          of: 'owVAtsYvsDMi7ZKIMFNYxA',
          plid: 'AAXqPemOPyFiFog4',
          referrer: 'https://www.youtube.com/embed/02oNDLYDJPY?version=3&autoplay=1&cc_load_policy=3&color=white&controls=0&loop=1&mute=1&rel=0&modestbranding=1&enablejsapi=1&playlist=02oNDLYDJPY&vq=hd1080',
          rt: 5.846,
          size: '1680:1047',
          ver: 2,
          vm: 'CAEQABgEOjJBTGV0MXV4a2x4UDJKSDE2Mjg4MFcyUUZWRzJ5c01fMWFMeTlVN0NkOWx4VUhNRzB1d2JWQVBta0tES25mM0tyYnZSNVlQVktDdy1kNGFWWW1ld3kydnZCUXVaeGcxTGVuVTNxZWtkTDFlZjhEMEh4QVd6bFQ1RF9vWlFVUmpTNVMzbXM1dkQ3N3c',
          volume: 100
        },
        url: 'https://www.youtube.com/api/stats/delayplay?ns=yt&el=embedded&cpn=PuzmoKP5DeMAndks&ver=2&cmt=4.152&fmt=248&fs=0&rt=5.846&euri=https%3A%2F%2Fanoeuropeujuventude.ipdj.gov.pt%2F&lact=5910&cl=478376401&mos=1&volume=100&cbr=Chrome&cbrver=93.0.4577.0&c=WEB_EMBEDDED_PLAYER&cver=1.20221002.00.00&cplayer=UNIPLAYER&cos=X11&cplatform=DESKTOP&autoplay=1&epm=1&delay=4&hl=en_US&cr=PT&len=17.021&fexp=23983296%2C24001373%2C24002022%2C24002025%2C24004644%2C24007246%2C24080738%2C24135310%2C24135692%2C24169501%2C24171248%2C24197275%2C24219382%2C24226335%2C24248385%2C24255165%2C24276632%2C24277989%2C24278546%2C24283280%2C24289901%2C24289930%2C24290131%2C24297611%2C24298641%2C24298652%2C39322399&afmt=251&size=1680%3A1047&inview=0&muted=1&docid=02oNDLYDJPY&ei=M8M8Y9aVM4u6W73hl4AO&plid=AAXqPemOPyFiFog4&referrer=https%3A%2F%2Fwww.youtube.com%2Fembed%2F02oNDLYDJPY%3Fversion%3D3%26autoplay%3D1%26cc_load_policy%3D3%26color%3Dwhite%26controls%3D0%26loop%3D1%26mute%3D1%26rel%3D0%26modestbranding%3D1%26enablejsapi%3D1%26playlist%3D02oNDLYDJPY%26vq%3Dhd1080&list=TLGG10CrglXoWGMwNDEwMjAyMg&of=owVAtsYvsDMi7ZKIMFNYxA&vm=CAEQABgEOjJBTGV0MXV4a2x4UDJKSDE2Mjg4MFcyUUZWRzJ5c01fMWFMeTlVN0NkOWx4VUhNRzB1d2JWQVBta0tES25mM0tyYnZSNVlQVktDdy1kNGFWWW1ld3kydnZCUXVaeGcxTGVuVTNxZWtkTDFlZjhEMEh4QVd6bFQ1RF9vWlFVUmpTNVMzbXM1dkQ3N3c',
        log: {
          stack: [
            {
              fileName: 'https://www.youtube.com/embed/02oNDLYDJPY?version=3&autoplay=1&cc_load_policy=3&color=white&controls=0&loop=1&mute=1&rel=0&modestbranding=1&enablejsapi=1&playlist=02oNDLYDJPY&vq=hd1080',
              source: 'requested from https://www.youtube.com/embed/02oNDLYDJPY?version=3&autoplay=1&cc_load_policy=3&color=white&controls=0&loop=1&mute=1&rel=0&modestbranding=1&enablejsapi=1&playlist=02oNDLYDJPY&vq=hd1080 and matched with easyprivacy.txt filter ||youtube.com/api/stats/delayplay?'
            }
          ],
          timestamp: '2022-10-04T23:35:21.629Z'
        },
        occurrances: 2
      },
      {
        filter: '||youtube.com/ptracking?',
        listName: 'easyprivacy.txt',
        query: {
          cpn: 'PuzmoKP5DeMAndks',
          ei: 'M8M8Y9aVM4u6W73hl4AO',
          html5: 1,
          pltype: 'contentugc',
          ptk: 'youtube_none',
          video_id: '02oNDLYDJPY'
        },
        url: 'https://www.youtube.com/ptracking?html5=1&video_id=02oNDLYDJPY&cpn=PuzmoKP5DeMAndks&ei=M8M8Y9aVM4u6W73hl4AO&ptk=youtube_none&pltype=contentugc',
        log: {
          stack: [
            {
              fileName: 'https://www.youtube.com/embed/02oNDLYDJPY?version=3&autoplay=1&cc_load_policy=3&color=white&controls=0&loop=1&mute=1&rel=0&modestbranding=1&enablejsapi=1&playlist=02oNDLYDJPY&vq=hd1080',
              source: 'requested from https://www.youtube.com/embed/02oNDLYDJPY?version=3&autoplay=1&cc_load_policy=3&color=white&controls=0&loop=1&mute=1&rel=0&modestbranding=1&enablejsapi=1&playlist=02oNDLYDJPY&vq=hd1080 and matched with easyprivacy.txt filter ||youtube.com/ptracking?'
            }
          ],
          timestamp: '2022-10-04T23:35:17.586Z'
        },
        occurrances: 2
      },
      {
        filter: '/generate_204$~xmlhttprequest',
        listName: 'easyprivacy.txt',
        query: { VEC__g: null },
        url: 'https://www.youtube.com/generate_204?VEC__g',
        log: {
          stack: [
            {
              fileName: 'https://www.youtube.com/embed/PDJ_QlrlJys',
              source: 'requested from https://www.youtube.com/embed/PDJ_QlrlJys and matched with easyprivacy.txt filter /generate_204$~xmlhttprequest'
            }
          ],
          timestamp: '2022-10-04T23:35:17.233Z'
        },
        occurrances: 3
      },
      {
        filter: '/um-gdpr.',
        listName: 'fanboy-annoyance.txt',
        query: { ver: '2.5.0' },
        url: 'https://anoeuropeujuventude.ipdj.gov.pt/wp-content/plugins/ultimate-member/assets/js/um-gdpr.min.js?ver=2.5.0',
        log: {
          stack: [
            {
              fileName: 'https://anoeuropeujuventude.ipdj.gov.pt/',
              source: 'requested from https://anoeuropeujuventude.ipdj.gov.pt/ and matched with fanboy-annoyance.txt filter /um-gdpr.'
            }
          ],
          timestamp: '2022-10-04T23:35:11.751Z'
        },
        occurrances: 1
      },
      {
        filter: '||googletagmanager.com^',
        listName: 'easyprivacy.txt',
        query: { id: 'G-38EJX5QSL7' },
        url: 'https://www.googletagmanager.com/gtag/js?id=G-38EJX5QSL7',
        log: {
          stack: [
            {
              fileName: 'https://anoeuropeujuventude.ipdj.gov.pt/',
              source: 'requested from https://anoeuropeujuventude.ipdj.gov.pt/ and matched with easyprivacy.txt filter ||googletagmanager.com^'
            }
          ],
          timestamp: '2022-10-04T23:35:11.742Z'
        },
        occurrances: 1
      }
    ]
  },
  {
    _id: ObjectId("633cc5995925606641f17b25"),
    id: '29bf349df33668baf5585059abfc162ca5a31d62',
    evidence: 'output/banner0/2022-10-04/anqep.gov.pt/inspection.json',
    country: 'portugal',
    when: '2022-10-04T23:45:29.835Z',
    beacons: [
      {
        filter: '.google-analytics.com/',
        listName: 'easyprivacy.txt',
        query: {
          _gid: 304836359.16649264,
          _r: 1,
          _s: 1,
          _u: 'YEBAAUABAAAAACAAI~',
          _v: 'j98',
          a: 1695837464,
          cid: 2068916098.1664927,
          de: 'UTF-8',
          dl: 'https://anqep.gov.pt/np4/home',
          dt: 'ANQEP - home',
          gjid: 732611379,
          gtm: '2oua30',
          je: 0,
          jid: 1459941953,
          sd: '24-bit',
          sr: '1680x927',
          t: 'pageview',
          tid: 'UA-173669149-1',
          ul: 'en-us',
          v: 1,
          vp: '1680x927',
          z: 1839303838
        },
        url: 'https://www.google-analytics.com/j/collect?v=1&_v=j98&a=1695837464&t=pageview&_s=1&dl=https%3A%2F%2Fanqep.gov.pt%2Fnp4%2Fhome&ul=en-us&de=UTF-8&dt=ANQEP%20-%20home&sd=24-bit&sr=1680x927&vp=1680x927&je=0&_u=YEBAAUABAAAAACAAI~&jid=1459941953&gjid=732611379&cid=2068916098.1664926538&tid=UA-173669149-1&_gid=304836359.1664926538&_r=1&gtm=2oua30&z=1839303838',
        log: {
          stack: [
            {
              fileName: 'https://anqep.gov.pt/np4/home',
              source: 'requested from https://anqep.gov.pt/np4/home and matched with easyprivacy.txt filter .google-analytics.com/'
            }
          ],
          timestamp: '2022-10-04T23:35:38.066Z'
        },
        occurrances: 1
      },
      {
        filter: '.google-analytics.com/',
        listName: 'easyprivacy.txt',
        query: null,
        url: 'https://www.google-analytics.com/analytics.js',
        log: {
          stack: [
            {
              fileName: 'https://anqep.gov.pt/np4/home',
              source: 'requested from https://anqep.gov.pt/np4/home and matched with easyprivacy.txt filter .google-analytics.com/'
            }
          ],
          timestamp: '2022-10-04T23:35:37.889Z'
        },
        occurrances: 1
      },
      {
        filter: '||googletagmanager.com^',
        listName: 'easyprivacy.txt',
        query: { id: 'UA-173669149-1' },
        url: 'https://www.googletagmanager.com/gtag/js?id=UA-173669149-1',
        log: {
          stack: [
            {
              fileName: 'https://anqep.gov.pt/np4/home',
              source: 'requested from https://anqep.gov.pt/np4/home and matched with easyprivacy.txt filter ||googletagmanager.com^'
            }
          ],
          timestamp: '2022-10-04T23:35:37.335Z'
        },
        occurrances: 1
      }
    ]
  },
  {
    _id: ObjectId("633cc59c897bdb2fe3bc0eee"),
    id: 'ff02fca2a077e7fb6f056a7f25e713eac79570db',
    evidence: 'output/banner0/2022-10-04/antt.dglab.gov.pt/inspection.json',
    country: 'portugal',
    when: '2022-10-04T23:45:32.604Z',
    beacons: [
      {
        filter: '.google-analytics.com/',
        listName: 'easyprivacy.txt',
        query: {
          utmac: 'UA-6614981-2',
          utmcc: '__utma=235887825.1445969221.1664926552.1664926552.1664926552.1;+__utmz=235887825.1664926552.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none);',
          utmcs: 'UTF-8',
          utmdt: 'Arquivo Nacional Torre do Tombo',
          utmfl: '-',
          utmhid: 750178993,
          utmhn: 'antt.dglab.gov.pt',
          utmht: 1664926551818,
          utmje: 0,
          utmjid: '',
          utmmt: 1,
          utmn: 2041389573,
          utmp: '/',
          utmr: '-',
          utms: 3,
          utmsc: '24-bit',
          utmsr: '1680x927',
          utmu: 'rAAAAAAAAAAAAAAAAAAAAAAE~',
          utmul: 'en-us',
          utmvp: '1680x927',
          utmwv: '5.7.2'
        },
        url: 'https://ssl.google-analytics.com/__utm.gif?utmwv=5.7.2&utms=3&utmn=2041389573&utmhn=antt.dglab.gov.pt&utmcs=UTF-8&utmsr=1680x927&utmvp=1680x927&utmsc=24-bit&utmul=en-us&utmje=0&utmfl=-&utmdt=Arquivo%20Nacional%20Torre%20do%20Tombo&utmhid=750178993&utmr=-&utmp=%2F&utmht=1664926551818&utmac=UA-6614981-2&utmcc=__utma%3D235887825.1445969221.1664926552.1664926552.1664926552.1%3B%2B__utmz%3D235887825.1664926552.1.1.utmcsr%3D(direct)%7Cutmccn%3D(direct)%7Cutmcmd%3D(none)%3B&utmjid=&utmmt=1&utmu=rAAAAAAAAAAAAAAAAAAAAAAE~',
        log: {
          stack: [
            {
              fileName: 'https://antt.dglab.gov.pt/',
              source: 'requested from https://antt.dglab.gov.pt/ and matched with easyprivacy.txt filter .google-analytics.com/'
            }
          ],
          timestamp: '2022-10-04T23:35:51.863Z'
        },
        occurrances: 2
      },
      {
        filter: '.google-analytics.com/',
        listName: 'easyprivacy.txt',
        query: {
          utmac: 'UA-47269714-15',
          utmcc: '__utma=235887825.1445969221.1664926552.1664926552.1664926552.1;+__utmz=235887825.1664926552.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none);',
          utmcs: 'UTF-8',
          utmdt: 'Arquivo Nacional Torre do Tombo',
          utmfl: '-',
          utmhid: 750178993,
          utmhn: 'antt.dglab.gov.pt',
          utmht: 1664926551762,
          utmje: 0,
          utmjid: 263307232,
          utmn: 504636282,
          utmp: '/',
          utmr: '-',
          utmredir: 1,
          utms: 1,
          utmsc: '24-bit',
          utmsr: '1680x927',
          utmu: 'qAAAAAAAAAAAAAAAAAAAAAAE~',
          utmul: 'en-us',
          utmvp: '1680x927',
          utmwv: '5.7.2'
        },
        url: 'https://ssl.google-analytics.com/r/__utm.gif?utmwv=5.7.2&utms=1&utmn=504636282&utmhn=antt.dglab.gov.pt&utmcs=UTF-8&utmsr=1680x927&utmvp=1680x927&utmsc=24-bit&utmul=en-us&utmje=0&utmfl=-&utmdt=Arquivo%20Nacional%20Torre%20do%20Tombo&utmhid=750178993&utmr=-&utmp=%2F&utmht=1664926551762&utmac=UA-47269714-15&utmcc=__utma%3D235887825.1445969221.1664926552.1664926552.1664926552.1%3B%2B__utmz%3D235887825.1664926552.1.1.utmcsr%3D(direct)%7Cutmccn%3D(direct)%7Cutmcmd%3D(none)%3B&utmjid=263307232&utmredir=1&utmu=qAAAAAAAAAAAAAAAAAAAAAAE~',
        log: {
          stack: [
            {
              fileName: 'https://antt.dglab.gov.pt/',
              source: 'requested from https://antt.dglab.gov.pt/ and matched with easyprivacy.txt filter .google-analytics.com/'
            }
          ],
          timestamp: '2022-10-04T23:35:51.784Z'
        },
        occurrances: 1
      },
      {
        filter: '.google-analytics.com/',
        listName: 'easyprivacy.txt',
        query: null,
        url: 'https://ssl.google-analytics.com/ga.js',
        log: {
          stack: [
            {
              fileName: 'https://antt.dglab.gov.pt/',
              source: 'requested from https://antt.dglab.gov.pt/ and matched with easyprivacy.txt filter .google-analytics.com/'
            }
          ],
          timestamp: '2022-10-04T23:35:51.501Z'
        },
        occurrances: 1
      },
      {
        filter: '/img/rss.',
        listName: 'fanboy-annoyance.txt',
        query: null,
        url: 'https://antt.dglab.gov.pt/wp-content/themes/antt/img/rss.png',
        log: {
          stack: [
            {
              fileName: 'https://antt.dglab.gov.pt/',
              source: 'requested from https://antt.dglab.gov.pt/ and matched with fanboy-annoyance.txt filter /img/rss.'
            }
          ],
          timestamp: '2022-10-04T23:35:51.266Z'
        },
        occurrances: 1
      }
    ]
  },
  {
    _id: ObjectId("633cc5a23f55f3ce039e07d2"),
    id: 'e3cdd983ec8698f661b8e3d758a98ae023b2c452',
    evidence: 'output/banner0/2022-10-04/azoreana.azores.gov.pt/inspection.json',
    country: 'portugal',
    when: '2022-10-04T23:45:38.146Z',
    beacons: [
      {
        filter: '$ping,third-party',
        listName: 'easyprivacy.txt',
        query: {
          _et: 13,
          _p: 2122710746,
          _s: 2,
          _z: 'ccd.v9B',
          cid: 123127043.16649266,
          dl: 'https://azoreana.azores.gov.pt/',
          dt: 'AZoreana',
          en: 'scroll',
          'epn.percent_scrolled': 90,
          gtm: '2oea30',
          sct: 1,
          seg: 0,
          sid: 1664926575,
          sr: '1680x927',
          tid: 'G-GFRGFY54D3',
          uaa: '',
          uab: '',
          uafvl: '',
          uam: '',
          uamb: 0,
          uap: '',
          uapv: '',
          uaw: 0,
          ul: 'en-us',
          v: 2
        },
        url: 'https://region1.google-analytics.com/g/collect?v=2&tid=G-GFRGFY54D3&gtm=2oea30&_p=2122710746&cid=123127043.1664926576&ul=en-us&sr=1680x927&uaa=&uab=&uafvl=&uamb=0&uam=&uap=&uapv=&uaw=0&_z=ccd.v9B&_s=2&sid=1664926575&sct=1&seg=0&dl=https%3A%2F%2Fazoreana.azores.gov.pt%2F&dt=AZoreana&en=scroll&epn.percent_scrolled=90&_et=13',
        log: {
          stack: [
            {
              fileName: 'https://azoreana.azores.gov.pt/',
              source: 'requested from https://azoreana.azores.gov.pt/ and matched with easyprivacy.txt filter $ping,third-party'
            }
          ],
          timestamp: '2022-10-04T23:36:21.184Z'
        },
        occurrances: 2
      },
      {
        filter: '||googletagmanager.com^',
        listName: 'easyprivacy.txt',
        query: { id: 'G-GFRGFY54D3' },
        url: 'https://www.googletagmanager.com/gtag/js?id=G-GFRGFY54D3',
        log: {
          stack: [
            {
              fileName: 'https://azoreana.azores.gov.pt/',
              source: 'requested from https://azoreana.azores.gov.pt/ and matched with easyprivacy.txt filter ||googletagmanager.com^'
            }
          ],
          timestamp: '2022-10-04T23:36:15.767Z'
        },
        occurrances: 1
      }
    ]
  },
  {
    _id: ObjectId("633cc5a70b87fe086558b58c"),
    id: '98a417073b44585976c6258b69589bd1008efe9f',
    evidence: 'output/banner0/2022-10-04/bep.azores.gov.pt/inspection.json',
    country: 'portugal',
    when: '2022-10-04T23:45:43.511Z',
    beacons: [
      {
        filter: '$ping,third-party',
        listName: 'easyprivacy.txt',
        query: {
          _et: 32,
          _p: 784271164,
          _s: 2,
          _z: 'ccd.v9B',
          cid: 1784319004.1664927,
          dl: 'https://bep.azores.gov.pt/',
          dt: 'Bep Açores',
          en: 'scroll',
          'epn.percent_scrolled': 90,
          gtm: '2oea30',
          sct: 1,
          seg: 0,
          sid: 1664926606,
          sr: '1680x927',
          tid: 'G-VMVFG6Y30K',
          uaa: '',
          uab: '',
          uafvl: '',
          uam: '',
          uamb: 0,
          uap: '',
          uapv: '',
          uaw: 0,
          ul: 'en-us',
          v: 2
        },
        url: 'https://region1.google-analytics.com/g/collect?v=2&tid=G-VMVFG6Y30K&gtm=2oea30&_p=784271164&cid=1784319004.1664926606&ul=en-us&sr=1680x927&uaa=&uab=&uafvl=&uamb=0&uam=&uap=&uapv=&uaw=0&_z=ccd.v9B&_s=2&sid=1664926606&sct=1&seg=0&dl=https%3A%2F%2Fbep.azores.gov.pt%2F&dt=Bep%20A%C3%A7ores&en=scroll&epn.percent_scrolled=90&_et=32',
        log: {
          stack: [
            {
              fileName: 'https://bep.azores.gov.pt/',
              source: 'requested from https://bep.azores.gov.pt/ and matched with easyprivacy.txt filter $ping,third-party'
            }
          ],
          timestamp: '2022-10-04T23:36:51.335Z'
        },
        occurrances: 2
      },
      {
        filter: '.google-analytics.com/',
        listName: 'easyprivacy.txt',
        query: {
          _gid: 695708001.1664927,
          _r: 1,
          _s: 1,
          _u: 'YADAAUABAAAAACAAI~',
          _v: 'j98',
          a: 784271164,
          cid: 1784319004.1664927,
          de: 'UTF-8',
          dl: 'https://bep.azores.gov.pt/',
          dt: 'Bep Açores',
          gjid: 1746319232,
          gtm: '2oua30',
          je: 0,
          jid: 257756440,
          sd: '24-bit',
          sr: '1680x927',
          t: 'pageview',
          tid: 'UA-161283732-1',
          ul: 'en-us',
          v: 1,
          vp: '1680x927',
          z: 327986725
        },
        url: 'https://www.google-analytics.com/j/collect?v=1&_v=j98&a=784271164&t=pageview&_s=1&dl=https%3A%2F%2Fbep.azores.gov.pt%2F&ul=en-us&de=UTF-8&dt=Bep%20A%C3%A7ores&sd=24-bit&sr=1680x927&vp=1680x927&je=0&_u=YADAAUABAAAAACAAI~&jid=257756440&gjid=1746319232&cid=1784319004.1664926606&tid=UA-161283732-1&_gid=695708001.1664926607&_r=1&gtm=2oua30&z=327986725',
        log: {
          stack: [
            {
              fileName: 'https://bep.azores.gov.pt/',
              source: 'requested from https://bep.azores.gov.pt/ and matched with easyprivacy.txt filter .google-analytics.com/'
            }
          ],
          timestamp: '2022-10-04T23:36:46.672Z'
        },
        occurrances: 1
      },
      {
        filter: '.google-analytics.com/',
        listName: 'easyprivacy.txt',
        query: null,
        url: 'https://www.google-analytics.com/analytics.js',
        log: {
          stack: [
            {
              fileName: 'https://bep.azores.gov.pt/',
              source: 'requested from https://bep.azores.gov.pt/ and matched with easyprivacy.txt filter .google-analytics.com/'
            }
          ],
          timestamp: '2022-10-04T23:36:46.231Z'
        },
        occurrances: 1
      },
      {
        filter: '||googletagmanager.com^',
        listName: 'easyprivacy.txt',
        query: { cx: 'c', id: 'UA-161283732-1', l: 'dataLayer' },
        url: 'https://www.googletagmanager.com/gtag/js?id=UA-161283732-1&l=dataLayer&cx=c',
        log: {
          stack: [
            {
              fileName: 'https://bep.azores.gov.pt/',
              source: 'requested from https://bep.azores.gov.pt/ and matched with easyprivacy.txt filter ||googletagmanager.com^'
            }
          ],
          timestamp: '2022-10-04T23:36:46.063Z'
        },
        occurrances: 2
      }
    ]
  },
  {
    _id: ObjectId("633cc5aa2c6d88cd6c00d32a"),
    id: '011cdab945abeebabf612a89e5ce326e24bfa1ae',
    evidence: 'output/banner0/2022-10-04/bepa.azores.gov.pt/inspection.json',
    country: 'portugal',
    when: '2022-10-04T23:45:46.099Z',
    beacons: [
      {
        filter: '$ping,third-party',
        listName: 'easyprivacy.txt',
        query: {
          _et: 23,
          _p: 1191415719,
          _s: 2,
          _z: 'ccd.v9B',
          cid: 930764370.1664927,
          dl: 'https://bep.azores.gov.pt/',
          dt: 'Bep Açores',
          en: 'scroll',
          'epn.percent_scrolled': 90,
          gtm: '2oea30',
          sct: 1,
          seg: 0,
          sid: 1664926619,
          sr: '1680x927',
          tid: 'G-VMVFG6Y30K',
          uaa: '',
          uab: '',
          uafvl: '',
          uam: '',
          uamb: 0,
          uap: '',
          uapv: '',
          uaw: 0,
          ul: 'en-us',
          v: 2
        },
        url: 'https://region1.google-analytics.com/g/collect?v=2&tid=G-VMVFG6Y30K&gtm=2oea30&_p=1191415719&cid=930764370.1664926619&ul=en-us&sr=1680x927&uaa=&uab=&uafvl=&uamb=0&uam=&uap=&uapv=&uaw=0&_z=ccd.v9B&_s=2&sid=1664926619&sct=1&seg=0&dl=https%3A%2F%2Fbep.azores.gov.pt%2F&dt=Bep%20A%C3%A7ores&en=scroll&epn.percent_scrolled=90&_et=23',
        log: {
          stack: [
            {
              fileName: 'https://bep.azores.gov.pt/',
              source: 'requested from https://bep.azores.gov.pt/ and matched with easyprivacy.txt filter $ping,third-party'
            }
          ],
          timestamp: '2022-10-04T23:37:04.549Z'
        },
        occurrances: 2
      },
      {
        filter: '.google-analytics.com/',
        listName: 'easyprivacy.txt',
        query: {
          _gid: 1380848592.1664927,
          _r: 1,
          _s: 1,
          _u: 'YADAAUABAAAAACAAI~',
          _v: 'j98',
          a: 1191415719,
          cid: 930764370.1664927,
          de: 'UTF-8',
          dl: 'https://bep.azores.gov.pt/',
          dt: 'Bep Açores',
          gjid: 1586640025,
          gtm: '2oua30',
          je: 0,
          jid: 1280318303,
          sd: '24-bit',
          sr: '1680x927',
          t: 'pageview',
          tid: 'UA-161283732-1',
          ul: 'en-us',
          v: 1,
          vp: '1680x927',
          z: 184702543
        },
        url: 'https://www.google-analytics.com/j/collect?v=1&_v=j98&a=1191415719&t=pageview&_s=1&dl=https%3A%2F%2Fbep.azores.gov.pt%2F&ul=en-us&de=UTF-8&dt=Bep%20A%C3%A7ores&sd=24-bit&sr=1680x927&vp=1680x927&je=0&_u=YADAAUABAAAAACAAI~&jid=1280318303&gjid=1586640025&cid=930764370.1664926619&tid=UA-161283732-1&_gid=1380848592.1664926620&_r=1&gtm=2oua30&z=184702543',
        log: {
          stack: [
            {
              fileName: 'https://bep.azores.gov.pt/',
              source: 'requested from https://bep.azores.gov.pt/ and matched with easyprivacy.txt filter .google-analytics.com/'
            }
          ],
          timestamp: '2022-10-04T23:37:00.124Z'
        },
        occurrances: 1
      },
      {
        filter: '.google-analytics.com/',
        listName: 'easyprivacy.txt',
        query: null,
        url: 'https://www.google-analytics.com/analytics.js',
        log: {
          stack: [
            {
              fileName: 'https://bep.azores.gov.pt/',
              source: 'requested from https://bep.azores.gov.pt/ and matched with easyprivacy.txt filter .google-analytics.com/'
            }
          ],
          timestamp: '2022-10-04T23:36:59.705Z'
        },
        occurrances: 1
      },
      {
        filter: '||googletagmanager.com^',
        listName: 'easyprivacy.txt',
        query: { cx: 'c', id: 'UA-161283732-1', l: 'dataLayer' },
        url: 'https://www.googletagmanager.com/gtag/js?id=UA-161283732-1&l=dataLayer&cx=c',
        log: {
          stack: [
            {
              fileName: 'https://bep.azores.gov.pt/',
              source: 'requested from https://bep.azores.gov.pt/ and matched with easyprivacy.txt filter ||googletagmanager.com^'
            }
          ],
          timestamp: '2022-10-04T23:36:59.494Z'
        },
        occurrances: 2
      }
    ]
  }
]
etpir-default> 
```

