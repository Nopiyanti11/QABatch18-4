const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const chrome = require("selenium-webdriver/chrome");

describe("Belajar Bareng - Tugas Sesi 9", function () {
    this.timeout(30000); // Timeout global 30 detik untuk Mocha

    it("Should login and add user successfully", async function () {
        let options = new chrome.Options();
        //memastikan chrome bersih dari popup yang tidak diperlukan
        options.addArguments("--disable-features=PasswordLeakDetection");
        options.setUserPreferences({
            "credentials_enable_service": false,
            "profile.password_manager_enabled": false,
            "profile.password_manager_leak_detection": false
        });

        let driver = await new Builder()
            .forBrowser("chrome")
            .setChromeOptions(options)
            .build();

        try {
            // Membuka URL website 
            await driver.get("https://belajar-bareng.onrender.com/");

          // Proses Login (Menunggu elemen input dan tombol login muncul)
            let usernameInput = await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Username']")), 10000);
            let passwordInput = await driver.wait(until.elementLocated(By.xpath("//div[@class='password-wrapper']//input")), 10000);
            let loginButton = await driver.wait(until.elementLocated(By.xpath("//button[@type='submit']")), 10000);

            await usernameInput.sendKeys("admin"); 
            await passwordInput.sendKeys("admin");
            await loginButton.click();
            // Assertion Login: Memastikan berhasil masuk ke halaman dashboard/home
            let dashboardTitle = await driver.wait(
                until.elementLocated(By.xpath("//h2[text()='List Users']")),
                10000
            );
            assert.strictEqual(await dashboardTitle.isDisplayed(), true);

            // 2. Assertion Memastikan tombol Add/Tambah user juga tampil
            let addButton = await driver.wait(
                until.elementLocated(By.xpath("//button[@class='add']")),
                10000
            );
            assert.strictEqual(await addButton.isDisplayed(), true);

            // 3. Assertion Memastikan tombol Update/Perbarui user juga tampil
            let updateButton = await driver.wait(
                until.elementLocated(By.xpath("//button[@class='update']")),
                10000
            );
            assert.strictEqual(await updateButton.isDisplayed(), true);

            // 4. Assertion Memastikan tombol Delete/hapus user juga tampil
            let deleteButton = await driver.wait(
                until.elementLocated(By.xpath("//button[@class='delete']")),
                10000
            );
            assert.strictEqual(await deleteButton.isDisplayed(), true);

            
            // 5. Assertion: Memastikan tombol checkout/pesan user juga tampil
            let checkoutButton = await driver.wait(
                until.elementLocated(By.xpath("//button[@data-testid='checkout-button']")),
                10000
            );
                assert.strictEqual(await checkoutButton.isDisplayed(), true);

            // 6.assertion Ambil URL halaman saat ini
            let currentUrl = await driver.getCurrentUrl();
            assert.strictEqual(currentUrl, "https://belajar-bareng.onrender.com/users");

            // Proses Add User: Klik menu/tombol tambah user lalu isi form
            let menuAddUser = await driver.wait(until.elementLocated(By.xpath("//button[@class='add']")), 10000);
            await menuAddUser.click();

            let inputUsername = await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Username']")), 10000);
            let inputAge = await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Age']")), 10000);
            let submitUserBtn = await driver.wait(until.elementLocated(By.xpath("//button[@type='submit']")), 10000);

            await inputUsername.sendKeys("Nopiyanti");
            await inputAge.sendKeys("2");
            await submitUserBtn.click();
       
            // [TAMBAHAN STEP] Klik tombol/menu 'List' supaya pindah ke halaman daftar user
            let listNavBtn = await driver.wait(
                until.elementLocated(By.xpath("//button[@class='list']")), 
                10000
            );
            await listNavBtn.click();

            // lakukan assertion untuk mencari data user yang baru ditambahkan
            let insertedUser = await driver.wait(
                until.elementLocated(By.xpath("//h3[text()='Nopiyanti']")),
                10000
            );
            assert.strictEqual(await insertedUser.isDisplayed(), true);

        } finally {
            // Menutup browser setelah pengujian selesai
            await driver.quit();
        }
    });
});