> [!Important]
> Clone the repository into WSL. Running the following commands in Windows might lead to problems.
> 
> Don't have WSL installed? Check out [How to install WSL](https://learn.microsoft.com/en-us/windows/wsl/install)

## Get Started With Backend

#### 1. Working directory setup:
Open a terminal in your IDE and set backend folder as the current working directory (if you have not already done so):
```
cd backend
```

#### 2. Install Python3 (skip if already installed)
* To check if it is installed run the following command:
 ```
  python3 --version
 ```

Steps to install

```
# update the package repository
sudo apt update

# install python
sudo apt install python3

# verify installation
python3 --version
```

#### 3. Create Python virtual environment
create a python virtual environment on your local machine by running:
```
python3 -m venv mycity-venv
```
If you are using VS Code, a notification should pop up asking you if you want to enable the virtual environment for the current workspace. Click "Yes", then you can skip step 4.

#### 4. Activate the virtual environment
activate the virtual environment by running:
```
source mycity-venv/bin/activate
```
After successful activation, the prompt will change to include the name of the activated environment like so: (mycity-venv) $
   
#### 5. Install dependencies for the app
Install the required dependencies from requirements.txt by running:
```
python3 -m pip install -r requirements.txt
```

## How to run the app
To serve the functions locally, run the following command:
```
chalice local
```

## How to deploy chalice app
### Set up AWS Credentials
#### 1. Install AWS CLI
Follow the steps below:

```
# install the unzip package
sudo apt install unzip

# download the latest aws cli
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"

# use the unzip package to extract the downloaded archive
unzip awscliv2.zip

# now install the cli
sudo ./aws/install
```
Now that the cli is installed, clean up your workspace by deleting the archive awscliv2.zip and the extracted files/folders

#### 2. Configure AWS Credentials
Run ```aws configure``` and provide the following values:

```
 $ aws configure
 AWS Access Key ID [*************xxxx]: <Your AWS Access Key ID>
 AWS Secret Access Key [**************xxxx]: <Your AWS Secret Access Key>
 Default region name: [us-west-2]: us-west-2
```

### To Deploy
Run the following command:
```
chalice deploy
```

## Working in Backend
> [!Important]
> Make sure the virtual environment is activated whenever you run any commands in the terminal while working in backend folder.
>
> Sounds like too much work? Luckily, some IDEs like VS Code can be configured to do this automatically for you.
