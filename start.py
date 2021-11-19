from time import sleep
import subprocess

print('Sleeping 10 seconds before starting server...')
sleep(10)

subprocess.Popen(["python", "main.py"])
quit()