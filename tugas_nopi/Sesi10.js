const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const firefox = require("selenium-webdriver/firefox");
const { faker } = require('@faker-js/faker');

describe("Belajar Bareng - Tugas Sesi 10", function () {
    this.timeout(10000);
    let driver;

    // 1. before: Inisialisasi dan buka browser sekali di awal
    before(async function () {
        const options = new firefox.Options();
         //options.addArguments("-headless"); // Aktifkan jika ingin mode headless di Firefox

        driver = await new Builder()
            .forBrowser("firefox")
            .setFirefoxOptions(options)
            .build();
    });

    // 2. beforeEach: Mengunjungi URL dan melakukan login sebelum setiap melakukan it()
    beforeEach(async function () {
        await driver.get("https://belajar-bareng.onrender.com/");

        let usernameInput = await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Username']")), 15000);
        let passwordInput = await driver.wait(until.elementLocated(By.xpath("//div[@class='password-wrapper']//input")), 15000);
        let loginButton = await driver.wait(until.elementLocated(By.xpath("//button[@type='submit']")), 15000);

        await usernameInput.sendKeys("admin"); 
        await passwordInput.sendKeys("admin");
        await loginButton.click();
    });

    // 3. afterEach: Membersihkan cookies setelah SETIAP it() selesai
    afterEach(async function () {
        try {
            await driver.manage().deleteAllCookies();
        } catch (error) {
            console.log("Gagal menghapus cookies:", error);
        }
        console.log("Test completed.");
    });

    // 4. after: Menutup browser sekali di akhir seluruh rangkaian test
    after(async function () {
        if (driver) {
            await driver.quit();
            console.log("Driver closed.");
        }
    });

    // Skenario Test 1: Cek Dashboard
    it("Should display dashboard and elements successfully", async function () {
        // 1.Assertion Login: Memastikan berhasil masuk ke halaman dashboard/home
        let dashboardTitle = await driver.wait(
            until.elementLocated(By.xpath("//h2[text()='List Users']")),
            15000
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


    });

    // Skenario Test 2: Add User Menggunakan Faker
    it("Should add user successfully using Faker", async function () {
        let menuAddUser = await driver.wait(until.elementLocated(By.xpath("//button[@class='add']")), 15000);
        await menuAddUser.click();
        
        const firstName = faker.person.firstName();

        let inputUsername = await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Username']")), 15000);
        let inputAge = await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Age']")), 15000);
        let submitUserBtn = await driver.wait(until.elementLocated(By.xpath("//button[@type='submit']")), 15000);
        
        await inputUsername.sendKeys(firstName);
        await inputAge.sendKeys("2");
        await submitUserBtn.click();
        
        await driver.sleep(1000);

        let listNavBtn = await driver.wait(
            until.elementLocated(By.xpath("//button[@class='list']")), 
            15000
        );
        await listNavBtn.click();

        let insertedUser = await driver.wait(
            until.elementLocated(By.xpath(`//h3[text()='${firstName}']`)),
            15000
        );
        assert.strictEqual(await insertedUser.isDisplayed(), true);
    });
});