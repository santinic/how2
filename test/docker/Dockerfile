FROM ubuntu:20.04
RUN wget http://how2terminal.com/static/dist/debian/how2.dpkg
RUN dpkg -i how2.deb
RUN apt-get install -y -f
RUN how2 sort installed apt packages by size
