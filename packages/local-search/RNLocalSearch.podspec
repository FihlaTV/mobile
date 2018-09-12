package = "mobile-local-search"

Pod::Spec.new do |s|
  s.name         = "RNLocalSearch"
  s.version      = "0.0.1"
  s.summary      = "RNLocalSearch"
  s.description  = <<-DESC
                  RNLocalSearch
                   DESC
  s.license      = "MIT"
  s.author       = "kiwi.com"
  s.homepage     = "https://kiwi.com"
  s.source       = { path: 'RNLocalSearch.podspec' }


  s.requires_arc = true
  s.platform     = :ios, "7.0"


  s.preserve_paths = 'package.json', 'index.js'
  s.dependency "React"
  #s.dependency "others"

  s.source_files  = "ios/**/*.{h,m}"
end

  