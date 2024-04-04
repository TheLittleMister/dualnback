# Dual N-Back

In n-back task you need to remember n previous spatial or auditory stimuli. N-back is a memory test where n refers on how many previous stimuli must be remembered. Dual means that verbal auditory stimulus and spatial visual stimulus are presented at the same time and must be remembered separately.

Back-End: **Django**  
Front-End: **React with TypeScript**

# Setup

1. Download and Install Python 3.8.10 (https://www.python.org/)

2. Create a virtual enviroment.

   - Install Virtual Env:  
      Python3: `pip3 install virtualenv`  
      Python2: `pip install virtualenv`

   - _Windows_:
     - Create Virtual Env: `python -m venv myVirtualEnvName`
     - Activate Virtual Env: `myVirtualEnvName\Scripts\activate` (**_activate.bat_** if it doesn't work)
     - _Remember_ that to deactivate Virtual Env _later_ just type: `deactivate` (**_deactivate.bat_** if it doesn't work)
   - _Linux_:
     - Create Virtual Env: `virtualenv myVirtualEnvName`
     - Activate Virtual Env: `source myprojectenv/bin/activate`
     - _Remember_ that to deactivate Virtual Env _later_ just type: `deactivate`

3. Clone this project: `git clone https://github.com/TheLittleMister/dualnback.git`

4. Install dependencies:

   - Inside the project folder (Project root): `pip install -r requirements.txt`

5. Set project DEBUG mode:

   - Open up /dualnback/dualnback/settings.py:
     - Change Line 19 with: `DEBUG = True`

6. Install front-end dependencies and start react project:

   - Go to /dualnback/front-end:
     - Run: `npm install` to install dependencies
     - Run: `npm start` to start the project in `http://127.0.0.1:3000/`
   - Open up /dualnback/front-end/src/utils/utils.tsx:
     - Change Line 4 with: `export const urlAPI: string = "http://127.0.0.1:<your backend port>/api/";`

7. Migrations and Run server:

   - Inside the project folder (Project root):
     - 1. Make Database migrations: `python manage.py makemigrations <app>`
     - 2. Migrate: `python manage.py migrate <app>`
     - 3. Run server: `python manage.py runserver`
     - 4. If you want to change server port: `python manage.py runserver <your backend port>` _e.g_ `python manage.py runserver 8080`

8. To see the changes made before pull request:

   - Run `npm run build` in /dualnback/front-end and go to your browser and open: `http://127.0.0.1:8000/` or `http://127.0.0.1:<your backend port>/`

# Project contributors

Remember to keep our requirements.txt and package.json files up to date and clean if you contribute to the project:

- Inside the project folder (Project root): `pip freeze > requirements.txt`

Before making a pull request:

- Open up /dualnback/dualnback/settings.py:

  - Change Line 19 with: `DEBUG = False`

- Open up /dualnback/front-end/src/utils/utils.tsx:

  - Change Line 4 with: `export const urlAPI: string = "https://dualn-back.com/api/";`
