rm -rf ./data
mkdir -p ./data
node ./gameoflife_node.js

ffmpeg -framerate 30 -i ./data/iteration_%d.png -c:v libx264 out.mp4 -y