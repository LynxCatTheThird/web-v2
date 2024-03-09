#include <iostream>
#include <cstdlib>
using namespace std;

void hexoClean(){
  cout<<"Cleaning...\n";
  system("hexo clean > /dev/null");
  cout<<"Cleaned.\n";
}

void hexoServer(){
  hexoClean();
  cout<<"Starting...\n";
  system("hexo server > /dev/null");
}

void hexoBuild(){
  hexoClean();
  cout<<"Generating...\n";
  system("hexo generate > /dev/null");
  cout<<"Optimizing...\n";
  system("hexo swpp");
  cout<<"Deploying...\n";
  system("hexo d");
  hexoClean();
}

int main(int argc, char* argv[]) {
  if (argc == 1) {
    cout << "无效的参数\n";
  } else if (string(argv[1]) == "b") {
    hexoBuild();
  } else if (string(argv[1]) == "ut") {
    system("git submodule update --remote --merge");
  } else if (string(argv[1]) == "u") {
    system("ncu -u && npm install");
  } else if (string(argv[1]) == "s" || string(argv[1]) == "se") {
    hexoServer();
  } else {
    cout << "无效的参数\n";
  }
  return 0;
}
