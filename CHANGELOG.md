Changelog
## [2025.6.1](https://github.com/davidsneighbour/kollitsch.dev/compare/v2025.6.0...v2025.6.1) (2025-07-19)


### Theme

* **fix:** actually import utilities.css in global.css ([95840b3](https://github.com/davidsneighbour/kollitsch.dev/commit/95840b3d2eb926c682803103a0b8eba5a49a0567))
* **fix:** hiding honey pot field ([3a66bc7](https://github.com/davidsneighbour/kollitsch.dev/commit/3a66bc7b8d971114e9591d2d2274b7be9b3ae04b))


### Build System

* **netlify:** aaaaaaaaaand disable netlify adapter again ([48d0ad4](https://github.com/davidsneighbour/kollitsch.dev/commit/48d0ad474659b0a879f5485a632025819b5e0da3))

## [2025.6.0](https://github.com/davidsneighbour/kollitsch.dev/compare/v2025.5.5...v2025.6.0) (2025-07-19)


### Theme

* **feat:** add preconnect/prefetch headers to netlify config ([db7e004](https://github.com/davidsneighbour/kollitsch.dev/commit/db7e004a6d9ee05ff25e5e8d6dfdf10626ba6f98))
* **feat:** get contact form to work ([42b0db1](https://github.com/davidsneighbour/kollitsch.dev/commit/42b0db13e8d04fded21cd24c7a0a168a78c897a8))
* **fix:** 404 page event tracking fixes ([ac561da](https://github.com/davidsneighbour/kollitsch.dev/commit/ac561dacf6fbf0afaa3a82eff6af1299a9bf09a8))
* **fix:** better ts for loading the audit styles ([92e89e8](https://github.com/davidsneighbour/kollitsch.dev/commit/92e89e8504a9e8605c88a3e031e88e25654cda71))
* **fix:** doing some magic about changa one weight issue ([586b738](https://github.com/davidsneighbour/kollitsch.dev/commit/586b73878895b27739513612f26789aa926504be))
* **fix:** move icons to local icon set ([269114e](https://github.com/davidsneighbour/kollitsch.dev/commit/269114ebc279acc196ccc69c74812e2c6404b349))
* **fix:** yet another way to add the audit styles dev only ([ac39e32](https://github.com/davidsneighbour/kollitsch.dev/commit/ac39e32a4edae96253608f8c618de16b60a873ba))


### Features

* add crosspost configuration and setup ([d77b3e3](https://github.com/davidsneighbour/kollitsch.dev/commit/d77b3e347cbffdb583b8a51ed257020dd036e3a4))
* **netlify:** setup Netlify adapter ([cbd9982](https://github.com/davidsneighbour/kollitsch.dev/commit/cbd9982efe7deeeb85edc346532d9702fa7547a6))


### Documentation

* update component documentation ([ab516cb](https://github.com/davidsneighbour/kollitsch.dev/commit/ab516cbe407cfca60a7a53819ffe25064fcb1e10))

## [2025.5.5](https://github.com/davidsneighbour/kollitsch.dev/compare/v2025.5.4...v2025.5.5) (2025-07-18)


### Content

* **fix:** no quotes around dates in frontmatter ([9c2f817](https://github.com/davidsneighbour/kollitsch.dev/commit/9c2f817f1ec9ef57583b2daa0ec9775aa5cec3a9))
* **fix:** no quotes around lastmod frontmatter ([dccf1fb](https://github.com/davidsneighbour/kollitsch.dev/commit/dccf1fba934c28632a337f51de76682b7ddd9712))
* **schema:** use cover substructure schema only ([5d6ceda](https://github.com/davidsneighbour/kollitsch.dev/commit/5d6cedabaafeb0c57033ada0c6582ccfcf69f2db)), closes [estruyf/vscode-front-matter#958](https://github.com/estruyf/vscode-front-matter/issues/958) [estruyf/vscode-front-matter#960](https://github.com/estruyf/vscode-front-matter/issues/960)


### Theme

* **fix:** add a couple of (documented) (p)reset styles ([5dcdaf1](https://github.com/davidsneighbour/kollitsch.dev/commit/5dcdaf1408f28778db9784ed8710e2efc0502d70))
* **fix:** add aria-hidden property to footer title element ([f85d691](https://github.com/davidsneighbour/kollitsch.dev/commit/f85d691ab34d4941bcb9dd1d5bce9fbcc95c85d2))
* **fix:** add heading component for headline ([4cda4db](https://github.com/davidsneighbour/kollitsch.dev/commit/4cda4db77cf76b79d7052f11e3a03180b87c2aef))
* **fix:** config path suddenly throws not found error ([378c504](https://github.com/davidsneighbour/kollitsch.dev/commit/378c5048994775b8bd9c88d73a2bdef65e3d7c38))
* **fix:** various changes that the author can't recall ([1fbabf0](https://github.com/davidsneighbour/kollitsch.dev/commit/1fbabf0e8687031a3f39f2b55ab6e46e354062ee))


### Refactors

* rewrite topnavigation component ([4800ec1](https://github.com/davidsneighbour/kollitsch.dev/commit/4800ec11509a8044e4a1abb7e973daf9c63b019b))


### Tests

* add cheerio for testing and fix heading tests ([f3d3c32](https://github.com/davidsneighbour/kollitsch.dev/commit/f3d3c32214364f64737e0a210dd9f59f645b0b0e))


### Build System

* **deps:** update dependencies ([8588582](https://github.com/davidsneighbour/kollitsch.dev/commit/8588582721539476eb49b0a8139b4b78bf9f722d))
* **deps:** update dependencies ([af0ceac](https://github.com/davidsneighbour/kollitsch.dev/commit/af0ceacb4355587015b73dcde313b0b432c83c5e))
* **deps:** update dependencies ([aef1fae](https://github.com/davidsneighbour/kollitsch.dev/commit/aef1fae71c0a668638569b3d83920fa3f3b3f799))
* **eslint:** configure eslint setup ([d342cea](https://github.com/davidsneighbour/kollitsch.dev/commit/d342ceac1b3862a35d1255564fbf6404a7b2228d))
* **frontmatter:** remove blog content type from manual configuration ([d935128](https://github.com/davidsneighbour/kollitsch.dev/commit/d935128e8f2a612bbbc9c04ae0c75956b4d596ca))
* **tsconfig:** silence warnings about json imports ([7c3bc9e](https://github.com/davidsneighbour/kollitsch.dev/commit/7c3bc9e520a6b9c9c9b831912ed3da7855924592))
* **vscode:** astro code snippets for post type properties ([c54ec80](https://github.com/davidsneighbour/kollitsch.dev/commit/c54ec806309f3252da70de653f1fa861a3933552))
* **vscode:** set astro plugin as file handler for astro files ([08517d3](https://github.com/davidsneighbour/kollitsch.dev/commit/08517d3a893ae54ab226def8a5f6d33d230f71bd))
* **vscode:** use configured ts aliases for paths in imports ([4c442a6](https://github.com/davidsneighbour/kollitsch.dev/commit/4c442a6ee67b909bd7d82bcbc9aa035bdfebcfc4))

## [2025.5.4](https://github.com/davidsneighbour/kollitsch.dev/compare/v2025.5.3...v2025.5.4) (2025-07-14)


### Content

* **fix:** remove double linktitle frontmatter ([545c32e](https://github.com/davidsneighbour/kollitsch.dev/commit/545c32e2a510bdbbbd4418313c7303441e96483b))


### Theme

* **fix:** copyright byline in a column on sm and below ([5f70dad](https://github.com/davidsneighbour/kollitsch.dev/commit/5f70dad097b46e0f90dc0e6e632b5dec110ce75b))

## [2025.5.3](https://github.com/davidsneighbour/kollitsch.dev/compare/v2025.5.2...v2025.5.3) (2025-07-13)


### Content

* **update:** redirects for legacy sitemap addresses ([8a8a685](https://github.com/davidsneighbour/kollitsch.dev/commit/8a8a685335c53ce70d1fb759043caf510e6bc18a))


### Theme

* **fix:** proper spacing in third footer column ([6b2e3e3](https://github.com/davidsneighbour/kollitsch.dev/commit/6b2e3e332b2497e718be8084527a0539210220a6))

## [2025.5.2](https://github.com/davidsneighbour/kollitsch.dev/compare/v2025.5.1...v2025.5.2) (2025-07-13)


### Content

* **new:** post from June 30th ([c83a266](https://github.com/davidsneighbour/kollitsch.dev/commit/c83a266d199c6f367451f56c7747797c73f75153))
* **update:** topnavigation changes ([b93118a](https://github.com/davidsneighbour/kollitsch.dev/commit/b93118a22bad5261ae6a6660b24376ececc6405c))


### Theme

* **feat:** add github releases as content collection ([d758d5f](https://github.com/davidsneighbour/kollitsch.dev/commit/d758d5f1fadda217d8a3b327986b0cfca13e390f))
* **feat:** add youtube content collection setup ([655c035](https://github.com/davidsneighbour/kollitsch.dev/commit/655c035b06dd213ef647f8b67f8fb95bfc40cb55))
* **feat:** button component with theme, outline, size, block ([6b47258](https://github.com/davidsneighbour/kollitsch.dev/commit/6b47258719a945f73e45b2da7ceff66bc9b5fdc8))
* **fix:** 404 background image handling ([ef64edb](https://github.com/davidsneighbour/kollitsch.dev/commit/ef64edba0005110527f42c084bcf55d1cc020b9c))
* **fix:** 404 page background fixes ([5a9a489](https://github.com/davidsneighbour/kollitsch.dev/commit/5a9a489d2a2285aa77b4fe5e9a6682aad94e0334))
* **fix:** add button type to component and test page ([f71162a](https://github.com/davidsneighbour/kollitsch.dev/commit/f71162ae3b701a3a9312202911ea8830f57b20e6))
* **fix:** better flow on share separator for mobile devices ([08d15a2](https://github.com/davidsneighbour/kollitsch.dev/commit/08d15a2a3e4c2917fca5eb47af52122ce317f806))
* **fix:** body padding on small screens ([2fb1579](https://github.com/davidsneighbour/kollitsch.dev/commit/2fb1579e986d8f6f68fafca553740df45ff9a830))
* **fix:** proper positioning in flex box for article cards ([e83fd27](https://github.com/davidsneighbour/kollitsch.dev/commit/e83fd2750ea9b40687ddb7b599d698de76aa00da))
* **fix:** remove similarities component ([334755f](https://github.com/davidsneighbour/kollitsch.dev/commit/334755fa870a7a4d29887bc2c102deb0a6a7d7e3))
* **fix:** rework responsive ruler for less obstrusivity ([ef0a7d7](https://github.com/davidsneighbour/kollitsch.dev/commit/ef0a7d79e549620b74d7c52427059283eed1a087))
* **fix:** slot in Heading component instead of title prop ([a961444](https://github.com/davidsneighbour/kollitsch.dev/commit/a961444fc4b4b58bdb290a0ebb7a437bc487a269))
* **fix:** spacing in footer section on small devices ([8c08294](https://github.com/davidsneighbour/kollitsch.dev/commit/8c08294bb8fc73db11dcabd6f45d5907e685666e))
* **fix:** theme manager rework ([704f5d3](https://github.com/davidsneighbour/kollitsch.dev/commit/704f5d33cec42103bbce8dba08a728aef0f70d55))
* **fix:** theme selector fixes ([4d6ff2a](https://github.com/davidsneighbour/kollitsch.dev/commit/4d6ff2ad3f6da0d62ba8de66f5eab297011cbf6f))
* **fix:** type casting fixes ([cc86194](https://github.com/davidsneighbour/kollitsch.dev/commit/cc86194f77088a57fc1288a6bfcf649db1c00227))
* **fix:** various fixes all over the place ([68c1c13](https://github.com/davidsneighbour/kollitsch.dev/commit/68c1c13f1b158e7457174ef64489e92b6b9c5494))


### Documentation

* update docs about responsive layouts ([69d15e3](https://github.com/davidsneighbour/kollitsch.dev/commit/69d15e3c67550bec94b2265d31bf160fc8064c15))


### Refactors

* cleanup and reformatting ([e677d03](https://github.com/davidsneighbour/kollitsch.dev/commit/e677d0311b1479f68866b85092b740463a40e99e))
* code formatting ([ac52ecd](https://github.com/davidsneighbour/kollitsch.dev/commit/ac52ecd8497d5e3cb258e472a00e4360cd9efe9c))
* remove unused import ([ae1b40d](https://github.com/davidsneighbour/kollitsch.dev/commit/ae1b40de8a5d08f73015b804b52130e013249c43))


### Build System

* add favorites configuration to workspace ([d673075](https://github.com/davidsneighbour/kollitsch.dev/commit/d673075872bb860a8b8eb7414213c6036dd23e13))
* add vscode as scope to commitlint config ([5005dce](https://github.com/davidsneighbour/kollitsch.dev/commit/5005dce81f83851dc1fe9dca8b9564cc427c248a))
* **deps:** fix missing typescript-eslint dependency ([d1686be](https://github.com/davidsneighbour/kollitsch.dev/commit/d1686beb429369e541816912f3db7ea1d113dddb))
* **deps:** update dependencies ([5dadebf](https://github.com/davidsneighbour/kollitsch.dev/commit/5dadebf21607ac44fcf759721ed37a79f90a9871))
* **deps:** update dependencies ([2742fbf](https://github.com/davidsneighbour/kollitsch.dev/commit/2742fbfac99f5d5dceb75ee779c7bcbd2dd0b7d8))
* **deps:** update dependencies ([3136e8e](https://github.com/davidsneighbour/kollitsch.dev/commit/3136e8e88afcd9bb73852f75ad85bb95b920df1d))
* **deps:** update mcr.microsoft.com/devcontainers/typescript-node docker tag to v2 ([#1417](https://github.com/davidsneighbour/kollitsch.dev/issues/1417)) ([ae5ac4a](https://github.com/davidsneighbour/kollitsch.dev/commit/ae5ac4ad28106ef9352312c23f966e3d154d6aa4))
* **deps:** update site screenshot ([a89788c](https://github.com/davidsneighbour/kollitsch.dev/commit/a89788c28d98ba0c3099ac1598636662ef3518ae))
* **deps:** update site screenshot ([68bb860](https://github.com/davidsneighbour/kollitsch.dev/commit/68bb860040e073df489df80cffc7cad8b550a023))
* fix shared config setup ([f3beb08](https://github.com/davidsneighbour/kollitsch.dev/commit/f3beb08bd007858096c495c3aadccccac386c1cc))
* **fix:** remove old screenshot before creating ([5a1ac26](https://github.com/davidsneighbour/kollitsch.dev/commit/5a1ac26ad2c737ecc700c3bd706342047eeb3fae))
* **fix:** remove old screenshot script generation ([a70bb80](https://github.com/davidsneighbour/kollitsch.dev/commit/a70bb800ad568f942a61f809e547d0722e70464c))
* **fix:** update screenshot script ([a608a73](https://github.com/davidsneighbour/kollitsch.dev/commit/a608a73e2a92d5271a8b212da526f2b464786382))
* **netlify:** add .netlify/state.json to repository ([4043b68](https://github.com/davidsneighbour/kollitsch.dev/commit/4043b68a0849bc946fbc9fd52f912600c6b7ab32))
* **netlify:** fix redirects and headers of Netlify deploy ([7e91e22](https://github.com/davidsneighbour/kollitsch.dev/commit/7e91e2223143fe46b1827e4919e37153ef5ed044))
* re-add screenshot regeneration workflow for README ([e09c19e](https://github.com/davidsneighbour/kollitsch.dev/commit/e09c19eab3bfa8e544bc032f1ba5048f348d2921))
* refactor package.json build script ([dfef38d](https://github.com/davidsneighbour/kollitsch.dev/commit/dfef38d696ecb6365e64f500c58f5a9930e2ef0b))
* remove unused imports in astro config ([313ef68](https://github.com/davidsneighbour/kollitsch.dev/commit/313ef689052be366789a7923440c90227fe0f685))
* **vscode:** add astro code snippets for vscode ([b93f0cd](https://github.com/davidsneighbour/kollitsch.dev/commit/b93f0cde4345315f224aab95703c8a5db4755e14))
* **vscode:** install vale for plugin if required ([5848987](https://github.com/davidsneighbour/kollitsch.dev/commit/58489875977254211cb931b2b0aeaae5aba1281e))
* **vscode:** remove codespell extension ([dc4b59e](https://github.com/davidsneighbour/kollitsch.dev/commit/dc4b59edf37a74e9aea205d84cf35fd8b27dd918))


### CI

* **eslint:** cleanup eslint configuration ([1a08485](https://github.com/davidsneighbour/kollitsch.dev/commit/1a08485bc339064724d7a6b20b5f65f3670b321f))
* **fix:** proper path to yamllint.yaml ([4335f5c](https://github.com/davidsneighbour/kollitsch.dev/commit/4335f5c04e8e837135e8b3674b1f14257bd7d2e0))
* switch e2e tests to weekly only ([f9258c3](https://github.com/davidsneighbour/kollitsch.dev/commit/f9258c3958350f7d2f216f1f96ffe7234f78ed57))
* **testing:** re-enable preview run ([4bd6657](https://github.com/davidsneighbour/kollitsch.dev/commit/4bd6657987af19fd98b93786c6f4ba2de9b0beeb))
* update link check workflow to run only once weekly ([d170c58](https://github.com/davidsneighbour/kollitsch.dev/commit/d170c589b503b4a8f8a4ef3050db165a98c0529d))
* **yamllint:** 'on' in GH workflows is not an error ([fd84245](https://github.com/davidsneighbour/kollitsch.dev/commit/fd84245853e384abaace033e6917f89830a1fc14))


### Chore

* fixing issues between origin and here ([edb6870](https://github.com/davidsneighbour/kollitsch.dev/commit/edb68705619dd9475724e772e0abeb81e593af4c))

## [2025.5.1](https://github.com/davidsneighbour/kollitsch.dev/compare/v2025.5.0...v2025.5.1) (2025-06-30)


### Build System

* ignore release.json ([15a7160](https://github.com/davidsneighbour/kollitsch.dev/commit/15a716084f23a9cc925368954a7d13c79ee09419))
* remove partytown integration ([0e2f608](https://github.com/davidsneighbour/kollitsch.dev/commit/0e2f608495ab1907b8b2d29a4f85d561425d882f))

## [2025.5.0](https://github.com/davidsneighbour/kollitsch.dev/compare/v2025.4.8...v2025.5.0) (2025-06-30)


### Content

* **fix:** add descriptions (they are not optional) ([b105327](https://github.com/davidsneighbour/kollitsch.dev/commit/b105327fcd361ba18adfd558f42cf6f1afbc34e6))
* **fix:** add quotes around frontmatter and fix path to cover image ([d221d6c](https://github.com/davidsneighbour/kollitsch.dev/commit/d221d6cd119bc3ece47bbc4d43e212107dd760d1))
* **fix:** add resources configuration and fix frontmatter ([14aac72](https://github.com/davidsneighbour/kollitsch.dev/commit/14aac7245b3ef78628a05f0e1984e29f2cc437bc))
* **fix:** add rework frontmatter to content files ([7c5d755](https://github.com/davidsneighbour/kollitsch.dev/commit/7c5d755292a96e649ca0e1118794a7d508ce48bc))
* **fix:** add schema placeholders for content collections ([f80e1e6](https://github.com/davidsneighbour/kollitsch.dev/commit/f80e1e608104b7cbc98cf7304ec9d7e834221781))
* **fix:** cleanup frontmatter and remove gohugo docs ([4de5fa2](https://github.com/davidsneighbour/kollitsch.dev/commit/4de5fa2021dd3449e7815eb6730178e2cb7769d0))
* **fix:** import cover image from resources configuration ([6507eb0](https://github.com/davidsneighbour/kollitsch.dev/commit/6507eb0227c4b84f5bf0ac1920310a676bae826a))
* **fix:** more frontmatter fixes for content ([39a6bc8](https://github.com/davidsneighbour/kollitsch.dev/commit/39a6bc84273b949e22bd141cb7e40efb0ea41a7c))
* **fix:** move frontmatter dates into strings in ISO 8601 with timezone ([fa0b8be](https://github.com/davidsneighbour/kollitsch.dev/commit/fa0b8bed5b4d1006c8e092c7135a6d728bf23948))
* **fix:** move pages into pages directory and use pagelayout ([c88828f](https://github.com/davidsneighbour/kollitsch.dev/commit/c88828f98fb45d0a34891ff1df46cdaba8b51800))
* **fix:** no empty descriptions all over the site ([1f6e90b](https://github.com/davidsneighbour/kollitsch.dev/commit/1f6e90bca06c6761d6968c49a13a3348aa1222c1))
* **fix:** proper code language identifiers ([ff836a5](https://github.com/davidsneighbour/kollitsch.dev/commit/ff836a5e1876e877f41c4f9cfaf0ec4423c19f37))
* **fix:** re-add website content ([014c037](https://github.com/davidsneighbour/kollitsch.dev/commit/014c03700a30caa1d9edfa6286464df41127e4b0))
* **fix:** remove authors section ([c305ac5](https://github.com/davidsneighbour/kollitsch.dev/commit/c305ac54236f9043e69fdd1c74f9c9b41fc24a61))
* **fix:** remove remaining gohugo shortcodes ([a1cef9c](https://github.com/davidsneighbour/kollitsch.dev/commit/a1cef9ccfa5d64ea730c808449c610156a2b994b))
* **fix:** update frontmatter configurations ([9bc425f](https://github.com/davidsneighbour/kollitsch.dev/commit/9bc425f77b8928a91718d36b116a08c57917a4b0))
* re-add static files and assets ([375ef94](https://github.com/davidsneighbour/kollitsch.dev/commit/375ef9428e5c41619fb188fce6547e5b7645f6ad))
* **schema:** add default draft state ([682a9dd](https://github.com/davidsneighbour/kollitsch.dev/commit/682a9ddf8103daf56f19a6c74c2730d946da5d65))
* **schema:** add linktitle (must be shorter than title) ([2f25dfa](https://github.com/davidsneighbour/kollitsch.dev/commit/2f25dfa1063b97d248e8736b9d2abd18897304de))
* **schema:** cleanup schema configuration ([e8a74e0](https://github.com/davidsneighbour/kollitsch.dev/commit/e8a74e0b764e0ec30849781f77c7f9352214a87a))
* **schema:** fix issues with tags in frontmatter and schema ([57a1d63](https://github.com/davidsneighbour/kollitsch.dev/commit/57a1d63087f79e470d0e244407831d82b105986d))
* **schema:** lastModified is optional ([75860f6](https://github.com/davidsneighbour/kollitsch.dev/commit/75860f62ba3045e15c733083a6e68d033efa3768))
* **schema:** make description required and non-empty ([bfbd433](https://github.com/davidsneighbour/kollitsch.dev/commit/bfbd4337db1824618ae6760957736eef1ed8b49e))
* **schema:** move tags into single json file ([d99c86b](https://github.com/davidsneighbour/kollitsch.dev/commit/d99c86b71e0d89cff2adb5808f0a39395edf61bf))
* **schema:** transform cover frontmatter to object ([d6ed832](https://github.com/davidsneighbour/kollitsch.dev/commit/d6ed83258c41e549d7fb7d83cdb51fa2a438f68c))
* **update:** move slash pages around ([d1a70df](https://github.com/davidsneighbour/kollitsch.dev/commit/d1a70df9e1023ad6783a091ab4e64a97726af250))


### Theme

* **feat:** add .well-known/security.txt ([9f16955](https://github.com/davidsneighbour/kollitsch.dev/commit/9f169550b23bc8345e718894dc0e09374ded3038))
* **feat:** add article component ([5e1511d](https://github.com/davidsneighbour/kollitsch.dev/commit/5e1511d21443c5fb7446da543fb4b46e8f05ca24))
* **feat:** add Astro icon component ([a0749fc](https://github.com/davidsneighbour/kollitsch.dev/commit/a0749fc4640007d0e4484b662c9af62198bb2276))
* **feat:** add color-grid web component ([419f688](https://github.com/davidsneighbour/kollitsch.dev/commit/419f688b6d8ba9a9df5e8d22aebb218edd1e8429))
* **feat:** add datediff web component ([249a115](https://github.com/davidsneighbour/kollitsch.dev/commit/249a115c48971fd30b4c0ecf80a212d588504377))
* **feat:** add default post image abilities ([9b43342](https://github.com/davidsneighbour/kollitsch.dev/commit/9b43342e45c87f35b0e0dfffa00eacc67a7b2a71))
* **feat:** add DevOnly component ([e053e4f](https://github.com/davidsneighbour/kollitsch.dev/commit/e053e4feb347e2446ada95d438a98da64f940a68))
* **feat:** add expressivecode plugin ([3306090](https://github.com/davidsneighbour/kollitsch.dev/commit/330609094ea407dd87ff866cd1d71066dcdcbcb1))
* **feat:** add giscus integration ([efc7e2d](https://github.com/davidsneighbour/kollitsch.dev/commit/efc7e2df882b3629ce94902e68bfc56ad5981b64))
* **feat:** add heading component ([835b2fe](https://github.com/davidsneighbour/kollitsch.dev/commit/835b2fe31b0db293420ff4b1a15fdd97b93488df))
* **feat:** add IconLink component ([1a73ad6](https://github.com/davidsneighbour/kollitsch.dev/commit/1a73ad6c37a7edbb0ac0bbf0aaae5c29d17ed11b))
* **feat:** add lite-youtube component and shortcode ([948ef3f](https://github.com/davidsneighbour/kollitsch.dev/commit/948ef3fa26cd3d8c96e65d78d23e08d395c0f90d))
* **feat:** add markdown page layout ([ec15ff4](https://github.com/davidsneighbour/kollitsch.dev/commit/ec15ff455c1feeed8ed1f52d1f9729e94b90b533))
* **feat:** add meta and schema components ([a48ffbf](https://github.com/davidsneighbour/kollitsch.dev/commit/a48ffbf72d80163c1c7448d5e3057d27fb45291a))
* **feat:** add pages collection seteup ([ed80ea3](https://github.com/davidsneighbour/kollitsch.dev/commit/ed80ea3364db11d953ea9690f28985ed0f424f60))
* **feat:** add prose component for markdown content ([b1021f5](https://github.com/davidsneighbour/kollitsch.dev/commit/b1021f524e6115f44fb493d43c1a16c95d4569d0))
* **feat:** add shiki language configuration for crontab ([dea5315](https://github.com/davidsneighbour/kollitsch.dev/commit/dea53159671c4343173b735b0cf56b25d38cccd7))
* **feat:** add social share bar ([fff16fa](https://github.com/davidsneighbour/kollitsch.dev/commit/fff16fa5c1bef58ef67138ea3625f97f8c033061))
* **feat:** add system for featured post on the homepage ([43e1aad](https://github.com/davidsneighbour/kollitsch.dev/commit/43e1aadf10177cf1127e8f5665dd677874cc0584))
* **feat:** add tag pages ([0d431df](https://github.com/davidsneighbour/kollitsch.dev/commit/0d431df7181a1f62a892314850ef56c378a88640))
* **feat:** add testing component for color scheme (WIP) ([3d7b767](https://github.com/davidsneighbour/kollitsch.dev/commit/3d7b767165e90a79a0da1f6c7f4428d855776583))
* **feat:** add theme switcher component ([d5a8df6](https://github.com/davidsneighbour/kollitsch.dev/commit/d5a8df69cd9ceda080a6131262cb9e200d2f9f39))
* **feat:** add vscode edit link on dev ([25226c1](https://github.com/davidsneighbour/kollitsch.dev/commit/25226c1bc21fdde34d4a5c591d8c8987bc5df481))
* **feat:** favicon setup ([59d65a9](https://github.com/davidsneighbour/kollitsch.dev/commit/59d65a9e14b0977e810fb5141cc8a9c77e04f3b5))
* **feat:** frosted top navbar with progress bar ([be7aa2d](https://github.com/davidsneighbour/kollitsch.dev/commit/be7aa2d2960aa2df34693b8bf37a87b095402a3f))
* **feat:** pagination for blog section (WIP) ([5e45403](https://github.com/davidsneighbour/kollitsch.dev/commit/5e4540392190d1c802e6d626104737264c45b9b5))
* **feat:** re-add robots.txt with AI block ([2ce8131](https://github.com/davidsneighbour/kollitsch.dev/commit/2ce81318633bdd689c690c62580dd3ff47e05646))
* **feat:** update navigation logic with active markers ([b6e2955](https://github.com/davidsneighbour/kollitsch.dev/commit/b6e295580d12a356d43f7428f82b854d6036741c))
* **fix:** 404 layout instead of component and fixes to layout inheritance ([7559aa5](https://github.com/davidsneighbour/kollitsch.dev/commit/7559aa55ed014b19d080ce18606fec5cb42910f2))
* **fix:** 404 page layout ([9819f5f](https://github.com/davidsneighbour/kollitsch.dev/commit/9819f5f19e97bdec73f607851d45956712cd2577))
* **fix:** adapt Giscus implementation to theme changes ([30acc5c](https://github.com/davidsneighbour/kollitsch.dev/commit/30acc5c9b44e53c356cfaab5e73aabeefcc1b29b))
* **fix:** add a link property to the heading component ([4b9efad](https://github.com/davidsneighbour/kollitsch.dev/commit/4b9efad5d2301c4fcdb580cefcf02d217bf9c593))
* **fix:** add BlogPost component and update blog page ([cdca4b3](https://github.com/davidsneighbour/kollitsch.dev/commit/cdca4b3cbe84e82a288deee82ba44d776d68dca1))
* **fix:** add component assets when component is found ([376d0c8](https://github.com/davidsneighbour/kollitsch.dev/commit/376d0c84bd6598734784045fae0bfe31dd334517))
* **fix:** add configurable classes and full height props to site layout ([b0c0f3c](https://github.com/davidsneighbour/kollitsch.dev/commit/b0c0f3cc618ce5ea14cd214f7f760be8e4e932c1))
* **fix:** add font sizes to headers ([b2c6d99](https://github.com/davidsneighbour/kollitsch.dev/commit/b2c6d996ae8e330d8949f716ff5e50f33e897c53))
* **fix:** add homepage url that points to dev home if running on dev ([bb31cba](https://github.com/davidsneighbour/kollitsch.dev/commit/bb31cba2ce9aab1e9c44b5a4910e36079959e329))
* **fix:** add padding to topnavigation and rename component ([02cc177](https://github.com/davidsneighbour/kollitsch.dev/commit/02cc177be41be02bc59fd388c21ce899f70c0a14))
* **fix:** add positioning and click-to-remove to breakpoint component ([3b9aa85](https://github.com/davidsneighbour/kollitsch.dev/commit/3b9aa85d1051a6d08255b9cfc7fe0ba81aa8bfb8))
* **fix:** add post as layout property ([31ebeb0](https://github.com/davidsneighbour/kollitsch.dev/commit/31ebeb0349b89091e656a91cd8e82fcd432236b9))
* **fix:** add priority property for article cover image ([4c31eb0](https://github.com/davidsneighbour/kollitsch.dev/commit/4c31eb03c8424da355141f43b8191bf1a4da80a3))
* **fix:** add progress bar below topnavigation ([f11cdb0](https://github.com/davidsneighbour/kollitsch.dev/commit/f11cdb0772d0f0d6358a203321057d5d0977ae41))
* **fix:** add proper menu items to footer navigation ([6fcfccf](https://github.com/davidsneighbour/kollitsch.dev/commit/6fcfccf1e3038714faee7386478fb1c92b0fd3cb))
* **fix:** add refactoring notes to templates ([07c6f28](https://github.com/davidsneighbour/kollitsch.dev/commit/07c6f28087649c0a1511a54e85ec79fbe7bdc8b0))
* **fix:** add tracking to 404 errors ([8a3544c](https://github.com/davidsneighbour/kollitsch.dev/commit/8a3544c19a7507d04e99f0a7922b54d79717e106))
* **fix:** add translate property to icon link component ([71c0e5b](https://github.com/davidsneighbour/kollitsch.dev/commit/71c0e5b577429ac6a460bf84ac941476e05e80b0))
* **fix:** add typescript declarations ([8e4ac1d](https://github.com/davidsneighbour/kollitsch.dev/commit/8e4ac1d892ee5652da64cc2d4845b76246c4f474))
* **fix:** adding darker gray style ([f05958a](https://github.com/davidsneighbour/kollitsch.dev/commit/f05958a72c4d2f3ce1813d8e297f6472ab676bfb))
* **fix:** allow empty slot in IconLink ([81805fd](https://github.com/davidsneighbour/kollitsch.dev/commit/81805fd3fff4af7086500d59a06bf3a770730b79))
* **fix:** article card border and layout fixes ([6c6bef5](https://github.com/davidsneighbour/kollitsch.dev/commit/6c6bef598e9f4fae2a3edb53cdd4e5f383b8ae8e))
* **fix:** breadcrumb and sitetitle design and schema fixes ([b261d07](https://github.com/davidsneighbour/kollitsch.dev/commit/b261d076d2328a6f0b1abbaea6afc20fcfb3776b))
* **fix:** breadcrumbs, giscus component, fixes to aliases ([90ba8f2](https://github.com/davidsneighbour/kollitsch.dev/commit/90ba8f238c4bc342ea6e15f66db5fbca9e45fd2c))
* **fix:** check if cover image is string or object ([01c3d29](https://github.com/davidsneighbour/kollitsch.dev/commit/01c3d29da7e20eb9dab488062ced3393245c851a))
* **fix:** cleanup and remove unused particles ([7470897](https://github.com/davidsneighbour/kollitsch.dev/commit/7470897b82ca7c4153d29869023f73fae71faf87))
* **fix:** cleanup console.log and add log utility function ([12f4cb1](https://github.com/davidsneighbour/kollitsch.dev/commit/12f4cb112219de19ec554c597b1e964e4406ac1f))
* **fix:** cleanup layouts ([1558b21](https://github.com/davidsneighbour/kollitsch.dev/commit/1558b212123fc98960123843a60a970912c6767f))
* **fix:** cleanup layouts and components ([8471ed3](https://github.com/davidsneighbour/kollitsch.dev/commit/8471ed3a2c69c6bf9bb2cad1b6fa5e3b7f0d9fb0))
* **fix:** cleanup tailwind setup and remove unused plugin ([37b6bd2](https://github.com/davidsneighbour/kollitsch.dev/commit/37b6bd223c32fd17752d07004d5c5763341556cf))
* **fix:** comment out empty custom variant block ([5ad032a](https://github.com/davidsneighbour/kollitsch.dev/commit/5ad032a0101fecfd379a98dad308aa61a6369c3b))
* **fix:** configure headings in prose component ([7104d26](https://github.com/davidsneighbour/kollitsch.dev/commit/7104d266b83e4bfbaa5016fc1b24e69835fcec9d))
* **fix:** consolidate site info json data ([9a5113a](https://github.com/davidsneighbour/kollitsch.dev/commit/9a5113ad4c8a1c4701a274aa90adafd486b2ab71))
* **fix:** container widths ([b66b342](https://github.com/davidsneighbour/kollitsch.dev/commit/b66b342e52cba76b586fdaf28aaf1452eed43065))
* **fix:** cover image evaluation ([e7e1f5d](https://github.com/davidsneighbour/kollitsch.dev/commit/e7e1f5d437552a381f452e3deeb254dda78b6dcd))
* **fix:** debugging page information ([9df116e](https://github.com/davidsneighbour/kollitsch.dev/commit/9df116e1899cf8cea000412cd90138549a83e641))
* **fix:** disable default experimental styles for image component ([0ff8b90](https://github.com/davidsneighbour/kollitsch.dev/commit/0ff8b9018f5152f5ef73e1df54b0677ee3f3fc2f))
* **fix:** don't show empty properties on headings ([5009799](https://github.com/davidsneighbour/kollitsch.dev/commit/5009799917ed21865f74184bf8d7bc6037be193a))
* **fix:** fix tag overviews and add limit via config ([37bc4c2](https://github.com/davidsneighbour/kollitsch.dev/commit/37bc4c251481772f531a58c9e7d6f38906740d2c))
* **fix:** fix TS casting errors ([27c815c](https://github.com/davidsneighbour/kollitsch.dev/commit/27c815c750545adb80ff4bfad80d730286e05068))
* **fix:** fix typescript issues with blog list and add identical blog lists ([c4f1654](https://github.com/davidsneighbour/kollitsch.dev/commit/c4f165494594bb7e86f7f7104d6286cf8062b609))
* **fix:** footer component fixes (width, sorting, design) ([96c1d92](https://github.com/davidsneighbour/kollitsch.dev/commit/96c1d92ee7d57fcac6dc50e830a4017ab7daa72e))
* **fix:** formatting for copyright line in footer component ([5ca6f8f](https://github.com/davidsneighbour/kollitsch.dev/commit/5ca6f8ff4b8fa0b119fb6aa5d71a1da172a8c30b))
* **fix:** head component changes ([11f12e3](https://github.com/davidsneighbour/kollitsch.dev/commit/11f12e3e86514f4a5161c5d1e524967d478e99f4))
* **fix:** header and footer color scheme ([704ac70](https://github.com/davidsneighbour/kollitsch.dev/commit/704ac70845a2b37632186a423e2c2aaf11498d1e))
* **fix:** hide site title in navbar on load ([55e4518](https://github.com/davidsneighbour/kollitsch.dev/commit/55e4518ac93a143c91263e64ca2b72bcee9a8947))
* **fix:** home page layout ([8c1e2af](https://github.com/davidsneighbour/kollitsch.dev/commit/8c1e2af26523e920020d3e873a6f6be843688513))
* **fix:** issues with sticky navbar on larger pages ([2afeab7](https://github.com/davidsneighbour/kollitsch.dev/commit/2afeab75a01cf4783d6044d281efcc86e7aa75e2))
* **fix:** layout and theme fixes ([e28a153](https://github.com/davidsneighbour/kollitsch.dev/commit/e28a153f2a6849157001cfb84adb7d285289fffb))
* **fix:** layout width on various breakpoints ([bdf0e47](https://github.com/davidsneighbour/kollitsch.dev/commit/bdf0e47a6b96fda68acd69420779b313d2dac913))
* **fix:** link to blog post in article card ([7b6d271](https://github.com/davidsneighbour/kollitsch.dev/commit/7b6d2713ec51420ee2a78fa11126835235cb1601))
* **fix:** logic and layout for article card component ([98a3c99](https://github.com/davidsneighbour/kollitsch.dev/commit/98a3c995e8217d3199beb1669968da22ae9e780a))
* **fix:** lots of fixes and complications for post handling ([d4a3b89](https://github.com/davidsneighbour/kollitsch.dev/commit/d4a3b89745b927dae9bc2efe3dab05d034c2e7d5))
* **fix:** make tag exclusion threshold configurable ([b16e1ce](https://github.com/davidsneighbour/kollitsch.dev/commit/b16e1ceef6b125db25ccb160e0d61cb6d7377994))
* **fix:** meta information layout for blog post ([a45ee70](https://github.com/davidsneighbour/kollitsch.dev/commit/a45ee704cee95497a326ac2fd1d71a129f8304d2))
* **fix:** more fixes to article layout and article design ([114903c](https://github.com/davidsneighbour/kollitsch.dev/commit/114903c35da6fb10891ce556a23d954b2ff8da51))
* **fix:** more space for content on all layouts ([08ebc70](https://github.com/davidsneighbour/kollitsch.dev/commit/08ebc7026f91ae962c507de3362cd62c70af0737))
* **fix:** move container classes into configuration ([4195613](https://github.com/davidsneighbour/kollitsch.dev/commit/4195613ab19fa1adb8744d89aa04f1e48228a653))
* **fix:** move head components around ([585743d](https://github.com/davidsneighbour/kollitsch.dev/commit/585743d5bcfdd00a6fa150efd441cc1f871b7ade))
* **fix:** move process of getting and sorting posts into utility function ([b16e186](https://github.com/davidsneighbour/kollitsch.dev/commit/b16e18687666179cdbf71bdfbbe19ce98005a697))
* **fix:** move site.json to setup.json ([ecad3eb](https://github.com/davidsneighbour/kollitsch.dev/commit/ecad3ebde44606320ac5a725702942ba71d396a3))
* **fix:** move sitetitle to component ([f6b3446](https://github.com/davidsneighbour/kollitsch.dev/commit/f6b34462f0792b4fd351c37df7102fcbce9723a7))
* **fix:** move theme components around ([0ef6a82](https://github.com/davidsneighbour/kollitsch.dev/commit/0ef6a829e6e7f08b85b8af21fb19a4e73dadd3bb))
* **fix:** navigation layouts ([100d5b8](https://github.com/davidsneighbour/kollitsch.dev/commit/100d5b8df57dee33a3bd04c0b09fd1136b81aa8a))
* **fix:** pagination and theme layouts ([72b9f23](https://github.com/davidsneighbour/kollitsch.dev/commit/72b9f238c3cd66bf6592cb5d0cbe1ed6d913fbfd))
* **fix:** pagination component setup ([a420d3e](https://github.com/davidsneighbour/kollitsch.dev/commit/a420d3e5a53a69ea28b901bce1c774b511847857))
* **fix:** pagination design ([e03a646](https://github.com/davidsneighbour/kollitsch.dev/commit/e03a6460a978e990b809c6db234f6734881b24c9))
* **fix:** pagination for single blog posts ([0847269](https://github.com/davidsneighbour/kollitsch.dev/commit/084726941bd98777868ba2dc2c0604319fff420a))
* **fix:** prev/next evaluation within single blog posts ([320b02b](https://github.com/davidsneighbour/kollitsch.dev/commit/320b02b97b466c0127c4008123811baf90e2be36))
* **fix:** proper blog card column layouts for breakpoints ([fdcdfd2](https://github.com/davidsneighbour/kollitsch.dev/commit/fdcdfd21eb4413983a0f2013aae692dcf7abf36f))
* **fix:** proper evaluation of post slugs ([8c70aaf](https://github.com/davidsneighbour/kollitsch.dev/commit/8c70aaf37f662c8b320e944b0a39282be4bfdb1f))
* **fix:** proper preparation of blogposting schema ([6f64756](https://github.com/davidsneighbour/kollitsch.dev/commit/6f6475696410dd94c9b38974e56ef3e3c32aa405))
* **fix:** proper type casting so that build succeeds ([86eb5bf](https://github.com/davidsneighbour/kollitsch.dev/commit/86eb5bf6853b12e00b3c82a6813cba1ae977bd72))
* **fix:** proper variable injection into footer ([0d00395](https://github.com/davidsneighbour/kollitsch.dev/commit/0d00395a5079f8b48e56b428851bb6cd13678daa))
* **fix:** reconfigure sitemap generation ([1700068](https://github.com/davidsneighbour/kollitsch.dev/commit/170006894c4e7d4ddd22c3f573442db8ecb0decd))
* **fix:** refactor VSCode links generation ([fbc6dc0](https://github.com/davidsneighbour/kollitsch.dev/commit/fbc6dc09cfec8362a9e4d895e6e1b969915c6711))
* **fix:** refine color scheme ([74136a4](https://github.com/davidsneighbour/kollitsch.dev/commit/74136a4fc1c78acdf1e579744026d2aaa8c30646))
* **fix:** remove color formats from text (WIP) ([3580a0c](https://github.com/davidsneighbour/kollitsch.dev/commit/3580a0c80e3c1e2dff61d33f9a061fb9ba545011))
* **fix:** remove deprecated component ([9357ff7](https://github.com/davidsneighbour/kollitsch.dev/commit/9357ff7b7b253d4f1ef4eb73c6dbf536624285a7))
* **fix:** remove double main container from index.astro ([aa74f0e](https://github.com/davidsneighbour/kollitsch.dev/commit/aa74f0ee92c50959460ee1a2c61f3585d0f41bd1))
* **fix:** remove obsolete files ([82d4200](https://github.com/davidsneighbour/kollitsch.dev/commit/82d42009ae26392074d0c502b2eb139de5f67919))
* **fix:** remove obsolete slash page layout ([8868b7e](https://github.com/davidsneighbour/kollitsch.dev/commit/8868b7e7d9eb38e49a53cc6f4717013349fd00d0))
* **fix:** remove particles that broke building the site ([5b89d14](https://github.com/davidsneighbour/kollitsch.dev/commit/5b89d141536d0558b5969d2db072dd4a0657c0e8))
* **fix:** remove phone field from contact form ([f624378](https://github.com/davidsneighbour/kollitsch.dev/commit/f62437882bebaf5399f26741ed269643e1a36e15))
* **fix:** remove placeholder links in header ([e3cf257](https://github.com/davidsneighbour/kollitsch.dev/commit/e3cf25767c308903e0fb91867fe9422fb50ddfd5))
* **fix:** remove tailwindcss/typography ([fe691a1](https://github.com/davidsneighbour/kollitsch.dev/commit/fe691a18dc6312f6a80db0030332f32b86e20880))
* **fix:** remove theme.css from imports ([62186c5](https://github.com/davidsneighbour/kollitsch.dev/commit/62186c5156d9823c51dfad5c12b1ad8e000afee4))
* **fix:** remove timestamp from blog posts ([c1a2d48](https://github.com/davidsneighbour/kollitsch.dev/commit/c1a2d48bfb68d72311c14294dc4abba658b43e43))
* **fix:** remove unneccessary heading ([bfc1614](https://github.com/davidsneighbour/kollitsch.dev/commit/bfc161485a7ee9d6abf5cb3b2f098b9c5e97c3c1))
* **fix:** remove unused components ([5eb9ff2](https://github.com/davidsneighbour/kollitsch.dev/commit/5eb9ff273c1474863f5dee9d2699584f878d08ee))
* **fix:** remove urlslug (identical to post.id) ([74b9cb2](https://github.com/davidsneighbour/kollitsch.dev/commit/74b9cb2efb5b48a3f3c0b71906d01ec7a9ef3d46))
* **fix:** remove weird shadow from codeboxes ([044ec03](https://github.com/davidsneighbour/kollitsch.dev/commit/044ec039ca59fde596e3817d52813afb1e2063c9))
* **fix:** restructure style setup ([a5a839c](https://github.com/davidsneighbour/kollitsch.dev/commit/a5a839cda55faea21ea284192b2d9a2f3559d51f))
* **fix:** rework favicon integration and generation ([17e062a](https://github.com/davidsneighbour/kollitsch.dev/commit/17e062a1d025bd072165fbcfe7715e361bf55f4d))
* **fix:** rework site wrapper layout ([413d77c](https://github.com/davidsneighbour/kollitsch.dev/commit/413d77c4dc5e630811feec759c57c581e20b4b1a))
* **fix:** rss feed items and permalinks ([ac510f3](https://github.com/davidsneighbour/kollitsch.dev/commit/ac510f3a8c83799ae3d08b8fe517d329d110a3dc))
* **fix:** silence TS error ([3b7c9d4](https://github.com/davidsneighbour/kollitsch.dev/commit/3b7c9d4a57debe749a9882d4e79d557604adbe01))
* **fix:** site header colors ([1aca1cd](https://github.com/davidsneighbour/kollitsch.dev/commit/1aca1cd761987a7ee74907e9ec44c9d2a629a413))
* **fix:** sort and limit rss feed items ([124af60](https://github.com/davidsneighbour/kollitsch.dev/commit/124af6071e0a1b2f443279d5465a52f458654dca))
* **fix:** theme colors setup for backgrounds ([c4aac0e](https://github.com/davidsneighbour/kollitsch.dev/commit/c4aac0eab64df4bf914ee59869e5ea7532e3b697))
* **fix:** topnavigation (still WIP, but functional) ([fbccc49](https://github.com/davidsneighbour/kollitsch.dev/commit/fbccc49c31010afebf9fa79d43d58a5aed612944))
* **fix:** transform opacity of navbar site title on scroll ([07bf78a](https://github.com/davidsneighbour/kollitsch.dev/commit/07bf78a29aac7cd47c15c44e88b867aa77bf00ef))
* **fix:** type casting fixes and deprecations ([8ce2525](https://github.com/davidsneighbour/kollitsch.dev/commit/8ce25254315b1e08d0b3d0c3f88b2bef4096027e))
* **fix:** type casting issues ([2018ee5](https://github.com/davidsneighbour/kollitsch.dev/commit/2018ee51d92b023e36dd03849065acbac6612a21))
* **fix:** typecasting for meta tags ([a2e4bb2](https://github.com/davidsneighbour/kollitsch.dev/commit/a2e4bb29f55f4a0fe804de57f05ba2dcd0411bce))
* **fix:** update and fix font setup ([8fe95c2](https://github.com/davidsneighbour/kollitsch.dev/commit/8fe95c2646a323ed0ee5af6407ab3df1bdd76377))
* **fix:** update column layout in footer ([57cd223](https://github.com/davidsneighbour/kollitsch.dev/commit/57cd223531714d574d1246b0cfd5f2303211d8e7))
* **fix:** update content theme styling ([9390f7c](https://github.com/davidsneighbour/kollitsch.dev/commit/9390f7c77659ce7b3579f9b6c027871a280dd56c))
* **fix:** update post image component hover overlay ([a758c55](https://github.com/davidsneighbour/kollitsch.dev/commit/a758c5569ecab30d150b3d563ebf54ed0404e1f7))
* **fix:** update share separator and pagination component ([f6a7f29](https://github.com/davidsneighbour/kollitsch.dev/commit/f6a7f2987d3755cf8869387b1bd4ebf042f928e6))
* **fix:** utility functions in helpers.ts ([2ab2632](https://github.com/davidsneighbour/kollitsch.dev/commit/2ab2632f7d39c7ccafea6f21e8dc27f79d670c73))
* **fix:** various fixes and "debugging things" ([32b5e50](https://github.com/davidsneighbour/kollitsch.dev/commit/32b5e50b4e2ad75c3d1e482c8df3ca906f53081c))
* **fix:** various fixes and changes, cleanup ([27a3513](https://github.com/davidsneighbour/kollitsch.dev/commit/27a35136c0b5ce0984a377c9032593c5b01aef3b))
* **fix:** various fixes and typecasting changes ([a70a024](https://github.com/davidsneighbour/kollitsch.dev/commit/a70a024eb7c870d415b698a7ce5ecef4f3e50be8))
* **fix:** various fixes to layout and setup ([51506a9](https://github.com/davidsneighbour/kollitsch.dev/commit/51506a9f4409b8909056eb34be13204da9594683))
* **fix:** various theme fixes to images and single post page ([99b49bd](https://github.com/davidsneighbour/kollitsch.dev/commit/99b49bd276eaa0cbac523f62351b80d163592662))
* **fix:** various typescript issue in layouts/pages/components ([48a636f](https://github.com/davidsneighbour/kollitsch.dev/commit/48a636f04bd66c4630213dc5ed72ff45b7ba0529))
* **schema:** fix content schema ([05830ec](https://github.com/davidsneighbour/kollitsch.dev/commit/05830ec0d816fe1b66a5c7401ea1ab3591b6c7c9))


### Bug Fixes

* **frontmatter:** add frontmatter configuration to .astroignore ([f55ada8](https://github.com/davidsneighbour/kollitsch.dev/commit/f55ada87c12686da5e3e8b86941f6eb8d70c3cf4))
* **netlify:** redirect to trailing slash URLs ([789dfff](https://github.com/davidsneighbour/kollitsch.dev/commit/789dfffdd020b82166eb1feceaa59596bdb96e65))
* **typescript:** fix typecasting issues and blog collection setup ([82c5d62](https://github.com/davidsneighbour/kollitsch.dev/commit/82c5d6243fe056ef33d9110428945084d4366776))


### Features

* remove unused utils and add getPermalink function ([3a8f5ae](https://github.com/davidsneighbour/kollitsch.dev/commit/3a8f5aed6f6c06136b7d8303a28255530d073223))


### Documentation

* add note about GoHugo with link to last version ([2d7d424](https://github.com/davidsneighbour/kollitsch.dev/commit/2d7d424aacff9bf43267db2ea35db999e82f446e))
* move preview screenshot to bottom of README.md ([6031b49](https://github.com/davidsneighbour/kollitsch.dev/commit/6031b49e7379795b52e52ada719f7104c4db8257))
* re-add repo documentation files ([a6f467a](https://github.com/davidsneighbour/kollitsch.dev/commit/a6f467a675dcabffeb6f7b7ff151b25a616016eb))
* testing a theory abt inline styles and GH markdown ([57b8361](https://github.com/davidsneighbour/kollitsch.dev/commit/57b8361d37b5324a22f830008cbf71415da2271a))
* update README.md ([08af3dd](https://github.com/davidsneighbour/kollitsch.dev/commit/08af3dd04cefeda642916665a63e7bba7f1c3845))
* update README.md ([d1a92e2](https://github.com/davidsneighbour/kollitsch.dev/commit/d1a92e2ed0888ee700060fbc70a2bcbafef0241f))
* yeah. sure. (GH table markup) ([e6c69e2](https://github.com/davidsneighbour/kollitsch.dev/commit/e6c69e2ceec7b944dad3767da94a86f60ba94f36))


### Refactors

* add comment to head component ([719cd5f](https://github.com/davidsneighbour/kollitsch.dev/commit/719cd5fc23f1cdd0d1d346449a5c4a3aaa6bbf77))
* add note to head component ([d4835aa](https://github.com/davidsneighbour/kollitsch.dev/commit/d4835aa8f9d415963204ed21be2f7f820403616a))
* add some todo comments ([5be84b9](https://github.com/davidsneighbour/kollitsch.dev/commit/5be84b97c4f37a37ad0095ec1514c84e16749af2))
* cleanup and reformat code ([1b6f77a](https://github.com/davidsneighbour/kollitsch.dev/commit/1b6f77a471fa5a2f17e48de14ff6f15599cb6d2e))
* comment formatting ([a025bd6](https://github.com/davidsneighbour/kollitsch.dev/commit/a025bd6d4a8493432de3ef58fedea405f536245b))
* remove console.log calls ([d0802a2](https://github.com/davidsneighbour/kollitsch.dev/commit/d0802a2ca38d48dc0f8f8bae627b9487909d9975))
* remove console.log lines ([ef18116](https://github.com/davidsneighbour/kollitsch.dev/commit/ef181168c6369af120fcc9de7417bb442154e045))
* **types:** fix types in share separator component ([c24f585](https://github.com/davidsneighbour/kollitsch.dev/commit/c24f58518f03a589cb6acdc17c98cefb51a09b75))


### Tests

* add color scheme testing pages ([54df2be](https://github.com/davidsneighbour/kollitsch.dev/commit/54df2be9c87864f1fe9fce8ab3044dfae01d714a))
* cleanup obsolete tests ([1fd5b5b](https://github.com/davidsneighbour/kollitsch.dev/commit/1fd5b5b5033dd553406a7ee54d27bc2afeb08aeb))
* fix the way we handle tests between dev and live ([284f495](https://github.com/davidsneighbour/kollitsch.dev/commit/284f495eb5a4a47c3119c8e290b16b3140c3f780))
* **fix:** proper path to css file ([161bee9](https://github.com/davidsneighbour/kollitsch.dev/commit/161bee932b561c9b670c6982b174a0ca6e59ef21))
* **fix:** remove environment setup option ([9ad458a](https://github.com/davidsneighbour/kollitsch.dev/commit/9ad458a3b1f9d44cb0c8c078144b01cfdf295023))
* reinstantiate playwright testing and configure for astro ([0c87180](https://github.com/davidsneighbour/kollitsch.dev/commit/0c8718019fe1a616170c4cbd3d03dda42cac699b))
* setup Vitest and Playwright for component unit and visual testing ([3f0a8ea](https://github.com/davidsneighbour/kollitsch.dev/commit/3f0a8ea8132f959e4c029ebce787bfe6f41cd31b))
* **setup:** add playwright init to post install script ([51cbc2a](https://github.com/davidsneighbour/kollitsch.dev/commit/51cbc2a765f6f4bab829000c3cd595adada86b1c))
* test: update configuration so that nothing is published on live ([ba46992](https://github.com/davidsneighbour/kollitsch.dev/commit/ba4699285eaf38c6d1659f2a27e013d6de4e4e38))


### Build System

* add .astroignore file ([61f4baa](https://github.com/davidsneighbour/kollitsch.dev/commit/61f4baad501d3e269b5f12c4b02628f32d8a2da1))
* add .env.template ([affd688](https://github.com/davidsneighbour/kollitsch.dev/commit/affd68861b3193a4f71ea07aeb6bd1f5fe578413))
* add AlpineJS ([5af2014](https://github.com/davidsneighbour/kollitsch.dev/commit/5af2014782d9ab22e715d1f2f1f1da9f575fb473))
* add AlpineJS to env.d.ts ([c9fc85b](https://github.com/davidsneighbour/kollitsch.dev/commit/c9fc85b6e2343c867a4965d6ae29bc69d9a75736))
* add backup folder to gitignore ([700af88](https://github.com/davidsneighbour/kollitsch.dev/commit/700af88af646f81da1919d583b3f2bae3ba1ae83))
* add beep rollup plugin ([5f7902f](https://github.com/davidsneighbour/kollitsch.dev/commit/5f7902fc14a37adfb2ea44c7896f99c4638c46e0))
* add csp to astro config ([5fdd97f](https://github.com/davidsneighbour/kollitsch.dev/commit/5fdd97fed7bb8f59ef38b598fbb89569c57d644d))
* add dev and dev:verbose scripts to be verbose on request only ([3ff0008](https://github.com/davidsneighbour/kollitsch.dev/commit/3ff0008d799d4f1169f954c30c9c340581800f57))
* add devcontainer setup and badges ([9bb68a6](https://github.com/davidsneighbour/kollitsch.dev/commit/9bb68a62c68d163dec81f3aa97a6b08994d60c4b))
* add script to manage extensions ([be68efd](https://github.com/davidsneighbour/kollitsch.dev/commit/be68efd65d7486728f696b11bf726df816d79f42))
* **astro:** update configuration ([14d6018](https://github.com/davidsneighbour/kollitsch.dev/commit/14d6018e917701574f362048236c839385300b29))
* cleanup package setup for netlify ([bb31573](https://github.com/davidsneighbour/kollitsch.dev/commit/bb315736c880e8823de456ddb5f94789939e56ce))
* **config:** add and configure netlify adapter ([58154f3](https://github.com/davidsneighbour/kollitsch.dev/commit/58154f3f820d50320b951588b5d86562bd2dd3de))
* **config:** update commit lint and generation configuration ([f88e8a1](https://github.com/davidsneighbour/kollitsch.dev/commit/f88e8a144866e5605e9f8672352f69b0b9a67f3d))
* **copilot:** add linting instructions for copilot ([b3dcaef](https://github.com/davidsneighbour/kollitsch.dev/commit/b3dcaef9a7a608dddd1036ce9b18f3951f6775f0))
* **copilot:** update copilot instructions ([5237072](https://github.com/davidsneighbour/kollitsch.dev/commit/5237072388f2c9d7a3fbca1b5786ef93835e0396))
* **deps:** add chrome devtools vite plugin ([a5618d7](https://github.com/davidsneighbour/kollitsch.dev/commit/a5618d7fabe734a96ba8295b1c547c22b644a0f4))
* **deps:** add js-yaml packges for frontmatter migration ([6ea2aff](https://github.com/davidsneighbour/kollitsch.dev/commit/6ea2aff7f0c6abb7603051d1524aa31c71c85885))
* **deps:** add toml and yaml plugins to vite config ([c513156](https://github.com/davidsneighbour/kollitsch.dev/commit/c5131562365881e4d744669a9f64c0b848ae65cc))
* **deps:** configure prettier packages ([c1c06c8](https://github.com/davidsneighbour/kollitsch.dev/commit/c1c06c8310fefd675a60954c56471676beee0646))
* **deps:** force brace-expansion version for dependabot ([5e05b15](https://github.com/davidsneighbour/kollitsch.dev/commit/5e05b159d1d4d7a382719e91845646c77f8c2b2c))
* **deps:** make dependencies static ([458432c](https://github.com/davidsneighbour/kollitsch.dev/commit/458432cea185f74ca96185bbcaa5d86b554d9ef1))
* **deps:** remove hard linked clsx ([8984440](https://github.com/davidsneighbour/kollitsch.dev/commit/8984440629a7dff8c6a8df0cfccde4cc8d95d261))
* **deps:** remove sentry and update dependencies ([bc6af3d](https://github.com/davidsneighbour/kollitsch.dev/commit/bc6af3d2fe0b0fcc45920ef01b219a6957e6582e))
* **deps:** update dependencies ([568636f](https://github.com/davidsneighbour/kollitsch.dev/commit/568636ff176dab4449700c5a3b9efaef3082ae73))
* **deps:** update dependencies ([c50ed1c](https://github.com/davidsneighbour/kollitsch.dev/commit/c50ed1cf4158bae60d7aec02b6fb3346780c9a64))
* **deps:** update dependencies ([1bb0dd3](https://github.com/davidsneighbour/kollitsch.dev/commit/1bb0dd3093af9746146028348c3b06c62ae3eaff))
* **deps:** update dependencies ([479e627](https://github.com/davidsneighbour/kollitsch.dev/commit/479e627794b7812e2f0c81c252216d65730b1b1c))
* **deps:** update dependencies ([2c71d9b](https://github.com/davidsneighbour/kollitsch.dev/commit/2c71d9bc2953914fc54d63fbf76694585faed1e8))
* **deps:** update dependencies ([15ea972](https://github.com/davidsneighbour/kollitsch.dev/commit/15ea972344ae422529720e9ae88ccddd525ff351))
* **deps:** update dependencies ([f906635](https://github.com/davidsneighbour/kollitsch.dev/commit/f9066351e3c657a5a4f3cd782d9817ee12a3e132))
* **deps:** update dependencies ([9057fc6](https://github.com/davidsneighbour/kollitsch.dev/commit/9057fc64efd362611d751b5eb0abd85a6d7c1bf5))
* **deps:** update dependencies ([1e9811f](https://github.com/davidsneighbour/kollitsch.dev/commit/1e9811fd76c9a6d398e2ef2e6a6ccd7867255cf1))
* **deps:** update dependencies ([da99bd1](https://github.com/davidsneighbour/kollitsch.dev/commit/da99bd14481d9fd964761e8f34dca2f142023dae))
* **deps:** update dependencies ([14f5623](https://github.com/davidsneighbour/kollitsch.dev/commit/14f562376f55fec30eb290b9fe8a83b851704b6e))
* **deps:** update dependencies ([9f0778a](https://github.com/davidsneighbour/kollitsch.dev/commit/9f0778a731d45b0f054d3c215429a818106118dc))
* **deps:** update dependencies ([a1cdc86](https://github.com/davidsneighbour/kollitsch.dev/commit/a1cdc867935622c4f173369052a2b89b81bb7908))
* **editorconfig:** add explicit setup for json(c) files ([3ef22f8](https://github.com/davidsneighbour/kollitsch.dev/commit/3ef22f869bb88f8ca535121faa6fa858efbe1a99))
* fix automatic source aliases in typescript and vite config ([4df8894](https://github.com/davidsneighbour/kollitsch.dev/commit/4df8894855e69b66f4ea3e53281a42eefa8fec32))
* fix redirect loop ([617e846](https://github.com/davidsneighbour/kollitsch.dev/commit/617e8466d4310a23f9b12cf2bdb2aa8588d6961c))
* **fix:** add @astrojs/netlify to packages ([a37d119](https://github.com/davidsneighbour/kollitsch.dev/commit/a37d119eb4c7f5a758233c915114e898563a6ed5))
* **fix:** add type to package.json importer in update script ([773a8e0](https://github.com/davidsneighbour/kollitsch.dev/commit/773a8e0cc93096de9ab1852082f17bced7781182))
* **fix:** collect frontmatter only in content collections ([4881d86](https://github.com/davidsneighbour/kollitsch.dev/commit/4881d86034974fddc1415058a1e64d2485c35d25))
* **fix:** frontmatter migration script changes ([e59ad93](https://github.com/davidsneighbour/kollitsch.dev/commit/e59ad93dbe82b6d470bfda47e160b717dd0d7459))
* **fix:** no astro checks on astro build ([55c882b](https://github.com/davidsneighbour/kollitsch.dev/commit/55c882b29f6ef4f41e222ac0bc0b78ff0b5c88c5))
* **fixpack:** update fixpack configuration ([14513ae](https://github.com/davidsneighbour/kollitsch.dev/commit/14513ae92919cd044d6f2ceb2f048fc4c6c987f5))
* **fix:** re-enable secretlint in lintstaged configuration ([3ce87c3](https://github.com/davidsneighbour/kollitsch.dev/commit/3ce87c3f5ab8e6a9c144495f39d0f76f5120d84b))
* **fix:** remove old package collection ([3e400e0](https://github.com/davidsneighbour/kollitsch.dev/commit/3e400e05469b50d1007dde71ac914e4c9db89562))
* **fix:** remove unused package particles and update package generation and update ([ec62db0](https://github.com/davidsneighbour/kollitsch.dev/commit/ec62db01e146bf9f8089e1c87e09daa926b1458c))
* **fix:** remove unused wireit script calls ([4cd0397](https://github.com/davidsneighbour/kollitsch.dev/commit/4cd039726f1a06dc00e4f1cc70f5d09e1760e33c))
* **frontmatter:** add Frontmatter CMS configuration and setup ([b59bf29](https://github.com/davidsneighbour/kollitsch.dev/commit/b59bf29c5859bd3d46b1a845a65217a3e8adf286))
* **frontmatter:** update frontmatter configuration for content ([c1f657b](https://github.com/davidsneighbour/kollitsch.dev/commit/c1f657b0106c7884d1bb07d0752d911b55bece05))
* **lintstaged:** fix configuration for jsonnet and style files ([226142d](https://github.com/davidsneighbour/kollitsch.dev/commit/226142da58204a13ee71d0b2b91c54faa858e3da))
* **netlify:** add netlify edge function configuration and setup ([051eac2](https://github.com/davidsneighbour/kollitsch.dev/commit/051eac275b02fb855c8ee1ac58bfca6a4b5b95c7))
* **netlify:** add redirect for missing trailing slashes to netlify configuration ([ac9e038](https://github.com/davidsneighbour/kollitsch.dev/commit/ac9e038953127a49cc482e0587ede085bde3e2a1))
* **netlify:** remove experimental netlify edge function ([99de4e4](https://github.com/davidsneighbour/kollitsch.dev/commit/99de4e4609fff41ac227cb9766dd3ff5e539e192))
* **netlify:** update redirects configuration ([f7c3515](https://github.com/davidsneighbour/kollitsch.dev/commit/f7c35154e5afa09c7c80284faa561db0e0db3c76))
* **packages:** list uncatalogued packages ([da2b5ab](https://github.com/davidsneighbour/kollitsch.dev/commit/da2b5abb862fa5f90775cb0d01d0e8739eb94d6c))
* **release:** update release scripts and setup ([44ad666](https://github.com/davidsneighbour/kollitsch.dev/commit/44ad6669d193f787b6540ba32de9ba9de909a5a9))
* remove obsolete frontmatter migration scripts ([571e8cd](https://github.com/davidsneighbour/kollitsch.dev/commit/571e8cd5e676c7acfe90c0739e3d79f5e70fe653))
* remove react from build setup ([4b7dce4](https://github.com/davidsneighbour/kollitsch.dev/commit/4b7dce4802bc20e43292b0bc3f7347463b2efea6))
* remove unused wireit entries in package.json ([172a7b6](https://github.com/davidsneighbour/kollitsch.dev/commit/172a7b69d174e186d310e1a1af67d9ed35c660f3))
* screenshot script for release process ([9549af2](https://github.com/davidsneighbour/kollitsch.dev/commit/9549af232241e6c421c9eed69c78490f090baf00))
* **scripts:** update clean routines in packages.json ([1a3fe11](https://github.com/davidsneighbour/kollitsch.dev/commit/1a3fe1161a6e713c0365d1b0205ca95258ca1638))
* set automatic ts alias paths for all src folders ([27b748f](https://github.com/davidsneighbour/kollitsch.dev/commit/27b748ffd39fa610cd770699bf105796d70c3faf))
* **spotlight:** add and configure Sentry Spotlight ([88e9c32](https://github.com/davidsneighbour/kollitsch.dev/commit/88e9c326beb84685e0cd75d53129e9cc15c90f82))
* update copilot instructions ([6fb46b1](https://github.com/davidsneighbour/kollitsch.dev/commit/6fb46b1b3ffd70a4bf7d94ec9a9e0ab8984ca52c))
* update gitignore ([7c02b23](https://github.com/davidsneighbour/kollitsch.dev/commit/7c02b23404f9b9e8a54a9e27a76958ced1e87f2e))
* update workspace configuration ([6d7c199](https://github.com/davidsneighbour/kollitsch.dev/commit/6d7c199595d9e790cb700b52d04fe4b11b453a99))
* update workspace configuration ([bea8209](https://github.com/davidsneighbour/kollitsch.dev/commit/bea8209120d387ffc23abe5031f41619d2b7bb49))
* **vscode:** always fix all fixable markdownlint issues on save ([5da9491](https://github.com/davidsneighbour/kollitsch.dev/commit/5da949123663072c93ea33141e00800835aa287d))
* **vscode:** run check and dev on workspace start ([83c5328](https://github.com/davidsneighbour/kollitsch.dev/commit/83c5328ea3d8ba0bcd8bca29be7b05ab2e8b77c5))
* **vscode:** update and document workspace configuration ([0dd8f9e](https://github.com/davidsneighbour/kollitsch.dev/commit/0dd8f9e002b2fada044578fba10386f27793902e))
* **vscode:** update workspace configuration ([9624b06](https://github.com/davidsneighbour/kollitsch.dev/commit/9624b06ff55981b9f5fee6115f0d16e0aacabe90))


### CI

* add astro check to lintstaged configuration ([fc07af8](https://github.com/davidsneighbour/kollitsch.dev/commit/fc07af8ba791d79bd987521dbc1a1f0c34a9a217))
* add lychee linting ([1b40a11](https://github.com/davidsneighbour/kollitsch.dev/commit/1b40a11c7c7d64f7480ab04cbcbf9c91a667ea06))
* add prettier configuration for astro files ([1d235a0](https://github.com/davidsneighbour/kollitsch.dev/commit/1d235a00f1141d6c95c98405a699605b5941a733))
* **biome:** disable check for undeclared imports in *.astro ([aa9ec19](https://github.com/davidsneighbour/kollitsch.dev/commit/aa9ec197dd9cf3da3ea15b9d2bfb695fed8afc9a))
* **biome:** handle noUnusedVariables errors in Astro components ([7eeb8ce](https://github.com/davidsneighbour/kollitsch.dev/commit/7eeb8cee09a99b3d3fd70b07e448df2b9f9e515d))
* **biome:** update Biome to v2.0.0 ([ed47a18](https://github.com/davidsneighbour/kollitsch.dev/commit/ed47a1856e0b44d68fc5a92bd20b0ccbfcd433a3))
* cache browsers for playwright e2e testing workflow ([b5206cd](https://github.com/davidsneighbour/kollitsch.dev/commit/b5206cd02c52a10926c8119d608bbdc0e4bf9615))
* **commitlint:** add scope overrides for content section ([bc60732](https://github.com/davidsneighbour/kollitsch.dev/commit/bc6073279e92fa953377ac9ae8c64c8939657369))
* disable prettier for astro files ([4c385c0](https://github.com/davidsneighbour/kollitsch.dev/commit/4c385c0e7cb82ff1ab67758833f43543696b8d86))
* **eslint:** configure and setup eslint ([bbd5e81](https://github.com/davidsneighbour/kollitsch.dev/commit/bbd5e81737d8e721463dff6f00ab7e5448201423))
* **eslint:** naming configs and cleanup ([5d562f9](https://github.com/davidsneighbour/kollitsch.dev/commit/5d562f94ee587b0eee6651311bfc9371dc5ff7e0))
* **eslint:** rework eslint configuration (WIP) ([7b33cbe](https://github.com/davidsneighbour/kollitsch.dev/commit/7b33cbe99ccb2134ad6b8944272aec0d8c763d2d))
* fix and reconfigure lint-staged and secretlint config ([b7a27bb](https://github.com/davidsneighbour/kollitsch.dev/commit/b7a27bbc3f6f78b294eddee1e5028746e8686ec9))
* fix markdown lintstaged configuration ([e9d2a19](https://github.com/davidsneighbour/kollitsch.dev/commit/e9d2a19fe2b80899c0ec88855e50a30d7708ef91))
* **fix:** absolute path to vale.ini ([0fadb8b](https://github.com/davidsneighbour/kollitsch.dev/commit/0fadb8b7fdeedc4b8243ac173f5f49778e6c7b2c)), closes [ChrisChinchilla/vale-vscode#66](https://github.com/ChrisChinchilla/vale-vscode/issues/66)
* **fix:** proper path to vale configuration ([fbca07e](https://github.com/davidsneighbour/kollitsch.dev/commit/fbca07ea22df2a5ec12a5951fbfe493136e2a93e))
* **fix:** re-add and configure markdownlint ([f8e9f49](https://github.com/davidsneighbour/kollitsch.dev/commit/f8e9f4922137a68888fc27067f3df99f210cfdea))
* **fix:** remove lockfile lint ([01945dd](https://github.com/davidsneighbour/kollitsch.dev/commit/01945dd501f598299f85d5ac77687ea500a151b0))
* **linkchecker:** add comment instead of opening new issue ([5789396](https://github.com/davidsneighbour/kollitsch.dev/commit/57893965ca359e7d2083e382853cd2978f759f42))
* **prettier:** move configuration from TS to JS ([d15c558](https://github.com/davidsneighbour/kollitsch.dev/commit/d15c558a6d528c4d3f7bd75b5b75d6ce9fd61bf9))
* **prettier:** re-add and configure prettier ([117ee3b](https://github.com/davidsneighbour/kollitsch.dev/commit/117ee3bec402e46e91179913ed96359378cbdc0c))
* **prettier:** update workspace configuration for Prettier plugins ([3c80fa0](https://github.com/davidsneighbour/kollitsch.dev/commit/3c80fa0733142825d0c9209c1c9ee1870857f8e2))
* re-add and configure biome ([05320f8](https://github.com/davidsneighbour/kollitsch.dev/commit/05320f8c7eb3214290500b15d8369b6f5d274ff6))
* re-add and configure github workflows and configuration ([0b64133](https://github.com/davidsneighbour/kollitsch.dev/commit/0b641332b8c22cb22edd34794e68afac57ad0c58))
* **remark:** update and fix remark configuration ([879826f](https://github.com/davidsneighbour/kollitsch.dev/commit/879826fb2e252b2ff2e66915d18005f43b8dcec1))
* remove prettier-eslint plugin from workspace ([e5cb6f9](https://github.com/davidsneighbour/kollitsch.dev/commit/e5cb6f903f7f2b0cc2d66602483970ea5308c46e))
* remove secretlint from lintstaged configuration ([f4b5f0f](https://github.com/davidsneighbour/kollitsch.dev/commit/f4b5f0f6188e9ff788dd41757200a61dd97a5fb7))
* **script:** collector for frontmatter inspection added ([31a5100](https://github.com/davidsneighbour/kollitsch.dev/commit/31a510049f3421a542e486eb64513748ae65e492))
* **secretlint:** disable secretlint on required home directory entry in vscode settings ([82bc3c8](https://github.com/davidsneighbour/kollitsch.dev/commit/82bc3c8037fcaffc643151feeb5f241996be2887))
* **secretlint:** reconfigure secretlint ([e64de5f](https://github.com/davidsneighbour/kollitsch.dev/commit/e64de5fe40de46205a7fd36340835ac0c7828783))
* **stylelint:** configure stylelint for linting and vscode ([90b9e0e](https://github.com/davidsneighbour/kollitsch.dev/commit/90b9e0e92ee89cc6a4d9d27288693079db14f9df))
* **stylelint:** remove scss configuration ([efc9905](https://github.com/davidsneighbour/kollitsch.dev/commit/efc9905121e22082c3ffbbd0d73c6801b6d6a454))
* **stylelint:** update and fix stylelint configuration ([f07a109](https://github.com/davidsneighbour/kollitsch.dev/commit/f07a109b54c8ef349131a9c4b49a2bdee4d61829))
* trying to fix astro extension settings ([63ef145](https://github.com/davidsneighbour/kollitsch.dev/commit/63ef1452138026e2a259b0874918b4b2e7c3fe16))
* update setup for e2e testing workflow ([6dba408](https://github.com/davidsneighbour/kollitsch.dev/commit/6dba4085fb28ab235e6e7e3bd4c653141fb1099c))
* **vale:** re-add and configure Vale ([507e0ef](https://github.com/davidsneighbour/kollitsch.dev/commit/507e0ef175abdf78819ed102dd29814ffe5a11c2))
* **vscode:** save only on focus change ([ff25781](https://github.com/davidsneighbour/kollitsch.dev/commit/ff2578182c7fde2f62423d97d3e50afcc06a2564))
* **vscode:** update workspace config to format on save ([32f2aae](https://github.com/davidsneighbour/kollitsch.dev/commit/32f2aae9d092780055817dc8582a7fc720f87b59))
* **yamllint:** add and configure yamllint ([8558d3a](https://github.com/davidsneighbour/kollitsch.dev/commit/8558d3a6f9278b5a390ca35988d8bb3f5ea99dda))


### Chore

* add initial astro build ([5c9c4a4](https://github.com/davidsneighbour/kollitsch.dev/commit/5c9c4a4cc9ad372660a1b022fb8f4f44bc1184a8))
* **git): revert "test(fix:** remove environment setup option" ([27b29bd](https://github.com/davidsneighbour/kollitsch.dev/commit/27b29bd3a12fd24048fb9480fc7cef5bdc2a45f9))


### Configuration

* add and sort missing alias paths to tsconfig ([2c30416](https://github.com/davidsneighbour/kollitsch.dev/commit/2c304160c9ea658a7972e6a454ef86e4df2e71c9))
* add existing redirects and headers for netlify deployments ([0ec6aed](https://github.com/davidsneighbour/kollitsch.dev/commit/0ec6aed569ed921b48fa87415316a6490706f6ce))
* add utils alias to tsconfig ([3dbb9b4](https://github.com/davidsneighbour/kollitsch.dev/commit/3dbb9b474c4145ccecd0efad2e36d056409eb0bb))
* **astro:** update image generation config to astro 5.10+ ([513f00e](https://github.com/davidsneighbour/kollitsch.dev/commit/513f00e60d56a3220173668057c73f1fb044ab59))
* cleanup astro configuration ([9cb2da8](https://github.com/davidsneighbour/kollitsch.dev/commit/9cb2da8f6b674bdcff98b94244529efc07713e16))
* **release:** reconfigure release and commit scripts ([e3cb0a7](https://github.com/davidsneighbour/kollitsch.dev/commit/e3cb0a714939af6945630130b44efa595b788c8c))
* remove fix from shared commit type config ([f863ba4](https://github.com/davidsneighbour/kollitsch.dev/commit/f863ba49a47bf2f44c72d39532c31538324cddcc))

## [2025.4.8](https://github.com/davidsneighbour/kollitsch.dev/compare/v2025.4.7...v2025.4.8) (2025-05-27)

## [2025.4.7](https://github.com/davidsneighbour/kollitsch.dev/compare/v2025.4.6...v2025.4.7) (2025-05-27)


### Theme

* **config:** enable markup.goldmark.renderer.unsafe for use of inline HTML ([b69cf1b](https://github.com/davidsneighbour/kollitsch.dev/commit/b69cf1b2d8cba782f5a29d46f29cff75247fb336))
* **fix:** clear out unused templates ([b2f8175](https://github.com/davidsneighbour/kollitsch.dev/commit/b2f8175e1e27f4552bd6171d483fd20b00507eb4))
* **fix:** refactor shortcodes and remove unused shortcodes ([cfdc8d4](https://github.com/davidsneighbour/kollitsch.dev/commit/cfdc8d4be7be2b3d6d393da8c9884b8b313b7661))


### Chore

* smaller changes to hugo setup ([1776280](https://github.com/davidsneighbour/kollitsch.dev/commit/1776280078e2a4b05dd55e06b1be2b91b5701f20))


### Build System

* script to find/audit shortcodes ([6775fc9](https://github.com/davidsneighbour/kollitsch.dev/commit/6775fc9991afd60fe09b447fcbc512a6a1da6921))


### CI

* **fix:** proper capture of {{%-based shortcodes ([c349bb6](https://github.com/davidsneighbour/kollitsch.dev/commit/c349bb6f51855c22666238d721dd15a56101da24))

## [2025.4.6](https://github.com/davidsneighbour/kollitsch.dev/compare/v2025.4.5...v2025.4.6) (2025-05-22)


### Theme

* **feat:** add TailwindCSS setup ([cd6b79d](https://github.com/davidsneighbour/kollitsch.dev/commit/cd6b79d5be5d4146f08e0cc7d970b147f7249268))
* **fix:** move hooks and filters into func/hooks ([d3b0ff9](https://github.com/davidsneighbour/kollitsch.dev/commit/d3b0ff93deca655abc91113f5ffa9ca722df294a))
* **fix:** remove unused func partials and move single use partials inline ([f8cf981](https://github.com/davidsneighbour/kollitsch.dev/commit/f8cf981196b8ea37ca77091c3c5201581ec5ffb5))


### Refactors

* cleanup and moving configs around ([b2a3cad](https://github.com/davidsneighbour/kollitsch.dev/commit/b2a3cad6c06824b1d0efcdeccff4356014b81690))

## [2025.4.5](https://github.com/davidsneighbour/kollitsch.dev/compare/v2025.4.4...v2025.4.5) (2025-05-21)


### Theme

* **fix:** add copyright line to theme files ([9849992](https://github.com/davidsneighbour/kollitsch.dev/commit/9849992e07100b2f25614da16dad90554bdfdea6))
* **fix:** remove text scrambler from title ([644eb5b](https://github.com/davidsneighbour/kollitsch.dev/commit/644eb5b554af9302b75e48e7ccc9d1dabe5c0f53))


### Bug Fixes

* move setup configuration into its own environment ([d796e70](https://github.com/davidsneighbour/kollitsch.dev/commit/d796e700125dffc79ff4bd6fad5d02b45834400f))


### Chore

* **git:** remove binaries submodule ([d566fe7](https://github.com/davidsneighbour/kollitsch.dev/commit/d566fe74f4e0862005dada8bd8ef9e44d9920845))
* remove .git-blame-ignore-revs ([cc3e0df](https://github.com/davidsneighbour/kollitsch.dev/commit/cc3e0df50ed08be4b2c7bff64613ffdfea34902c))
* remove .gitmodules ([5ff7aef](https://github.com/davidsneighbour/kollitsch.dev/commit/5ff7aefb8321978978c82e65cd47358f0b060224))

## [2025.4.4](https://github.com/davidsneighbour/kollitsch.dev/compare/v2025.4.3...v2025.4.4) (2025-05-21)


### Content

* **fix:** replace ... with … (ellipsis) ([87cb856](https://github.com/davidsneighbour/kollitsch.dev/commit/87cb8560bd982a1774eab2dd7758fd14fb51245a))


### Documentation

* cleanup CHANGELOG.md ([d5a73a4](https://github.com/davidsneighbour/kollitsch.dev/commit/d5a73a482f0282227e5c26f2d44fa4b0c43eb984))


### Refactors

* move content module into root repository ([8bce49c](https://github.com/davidsneighbour/kollitsch.dev/commit/8bce49c7bbafd764ce7d82bd2267ea2804315fba))
* restructure repo and move content module into repo ([ae81c03](https://github.com/davidsneighbour/kollitsch.dev/commit/ae81c0342f1e9dad35869042b06500647efb5eb4))
* rework frontmatter configuration ([1a72d78](https://github.com/davidsneighbour/kollitsch.dev/commit/1a72d78b5a448d75789a6b2582ca940709dc0820))


### Tests

* cleanup test setup ([f5e7254](https://github.com/davidsneighbour/kollitsch.dev/commit/f5e7254114d5795613af6cd16de04881f8afbe07))


### Build System

* **deps:** update dependencies ([f521ec1](https://github.com/davidsneighbour/kollitsch.dev/commit/f521ec1f7c0eb36370c889671a82c3c9cfcb9f0a))
* **git:** remove frontmatter submodule ([18ed969](https://github.com/davidsneighbour/kollitsch.dev/commit/18ed96908575e89bd3e3d85ccfef20ea4dbcadbc))
* **packages:** update version updater ([ac13392](https://github.com/davidsneighbour/kollitsch.dev/commit/ac1339222874b24b546da93bd7fc851be480533a))
* **server:** reconfigure server build ([0b65e9a](https://github.com/davidsneighbour/kollitsch.dev/commit/0b65e9a44c96c3259387040775431f2f244491ba))


### CI

* **fix:** add content to commitlint configuration ([4bcf0bf](https://github.com/davidsneighbour/kollitsch.dev/commit/4bcf0bfcc12b16ae79046c0717f6c8daecceb3a6))

## [2025.4.3](https://github.com/davidsneighbour/kollitsch.dev/compare/v2025.4.2...v2025.4.3) (2025-05-20)

### Build System

* **fix:** remove ANSI formatting from version string ([5d1c854](https://github.com/davidsneighbour/kollitsch.dev/commit/5d1c85489f0970f56856594d25b2d7b3a02f5051))

## [2025.4.2](https://github.com/davidsneighbour/kollitsch.dev/compare/v2025.4.1...v2025.4.2) (2025-05-20)

### Build System

* **fix:** remove ANSI formatting from version number ([e46d1ca](https://github.com/davidsneighbour/kollitsch.dev/commit/e46d1ca4c9aa40394cbabce363d57e031f3c83a1))

## [2025.4.1](https://github.com/davidsneighbour/kollitsch.dev/compare/v2025.4.0...v2025.4.1) (2025-05-20)

### Build System

* **fix:** proper version in CITATION.cff ([71bec6f](https://github.com/davidsneighbour/kollitsch.dev/commit/71bec6f56837bb2652bc5697010d49451c16edf5))
