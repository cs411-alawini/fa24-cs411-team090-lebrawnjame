from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
import os
import time

query = "Le Sserafim"  
save_directory = "frontend/public/media"  
number_of_images = 50
browser = "chrome"  

if browser == "chrome":
    driver = webdriver.Chrome()
elif browser == "firefox":
    driver = webdriver.Firefox()
else:
    raise ValueError("Unsupported browser")

if not os.path.exists(save_directory):
    os.makedirs(save_directory)

driver.get(f"https://www.google.com/imghp?hl=en")
search_box = driver.find_element(By.NAME, "q")
search_box.send_keys(query)
search_box.submit()

time.sleep(2)

actions = ActionChains(driver)
saved_images = 0
image_count = 25  

while saved_images < number_of_images:
    try:
        images = driver.find_elements(By.CSS_SELECTOR, "img.sFlh5c")

        if saved_images >= len(images):
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(2)
            continue


        image = images[saved_images]
        image.click()

        time.sleep(2)
        large_image = driver.find_element(By.CSS_SELECTOR, "img.sFlh5c")

        image_url = large_image.get_attribute("src")
        print(f"Image URL: {image_url}")

        if image_url and "http" in image_url:
            file_path = os.path.join(save_directory, f"image{image_count}.jpg")
            with open(file_path, "wb") as f:
                f.write(requests.get(image_url).content)
            print(f"Saved {file_path}")
            saved_images += 1
            image_count += 1

    except Exception as e:
        print(f"Error: {e}")
        break

driver.quit()s