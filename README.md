# Dual N-Back
In n-back task you need to remember n previous spatial or auditory stimuli.  N-back is a memory test where n refers on how many previous stimuli must be remembered.  Dual means that verbal auditory stimulus and spatial visual stimulus are presented at the same time and must be remembered separately.

Back-End: **Django**  
Front-End: **Vanilla JS**

# Setup
1. Download and Install Python (https://www.python.org/)  
   * *Linux*:  
       Python 3: `sudo apt install python3-pip python3-dev`  
       Python 2: `sudo apt install python-pip python-dev`  

2. Create a virtual enviroment.  
   * Install Virtual Env:  
        Python3: `pip3 install virtualenv`  
        Python2: `pip install virtualenv`  
        
   * *Windows*:
        - Create Virtual Env: `python -m venv myVirtualEnvName`  
        - Activate Virtual Env: `myVirtualEnvName\Scripts\activate` (***activate.bat*** if it doesn't work)
        - *Remember* that to deactivate Virtual Env *later* just type: `deactivate` (***deactivate.bat*** if it doesn't work) 
        
   * *Linux*:
        - Create Virtual Env: `virtualenv myVirtualEnvName`
        - Activate Virtual Env: `source myprojectenv/bin/activate`
        - *Remember* that to deactivate Virtual Env *later* just type: `deactivate`

3. Clone this project: `git clone https://github.com/TheLittleMister/dualnback.git`

4. Install dependencies: 
   * Inside the project folder (Project root): `pip install -r requirements.txt`

5. Set project DEBUG mode:
   * Open up /dualnback/dualnback/settings.py
   * Change Line 19 with: `DEBUG = True`
 
6. Migrations and Run server:
   * Inside the project folder (Project root):  
      * 1. Make Database migrations: `python manage.py makemigrations users`
      * 2. Migrate: `python manage.py migrate`
      * 3. Run server: `python manage.py runserver`
      * 4. If you want to change server port: `python manage.py runserver <your port>` *e.g* `python manage.py runserver 8080`
 
7. Go to your browser and open: `http://127.0.0.1:8000/` or `http://127.0.0.1:<your port>/`

# Front-End
## Where are the Static files? (JS/CSS/IMAGES/...)
   * /dualnback/templates/static

## Where are the HTML files?
   * /dualnback/templates
 
# Back-End
   * Djangooooooooooo! :D
