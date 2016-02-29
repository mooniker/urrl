require 'bundler/setup'
require 'sinatra'
require 'sinatra/reloader'
require 'active_record'
require 'hashids'
require 'json'

require_relative('db/connection')
require_relative('models/urrl')

require 'pry'

hashids = Hashids.new('URrLs are lightly salted', 5)

get '/' do
  @urrls = Urrl.all
  haml :index
end

get '/urrls' do
  Urrl.all.to_json
end

get '/:alias' do
  # look up alias in db
  urrl = Urrl.find_by(alias: params[:alias])
  if urrl # if it exists
    urrl.hits += 1 # increment hit counter and save
    urrl.save
    redirect urrl.url # redirect
  else # else redirect to root
    # FIXME pass along a flash error
    redirect '/'
  end
end

post '/' do
  # first check to see if url is already aliased
  puts "POST / #{params[:url]}"
  urrl = Urrl.find_by(url: params[:url])
  if urrl
    puts 'already got this one'
    # give user the existing alias
    return urrl.alias # TODO
  else
    new_urrl = Urrl.create(url: params[:url])
    new_hash = hashids.encode(new_urrl.id)
    puts new_hash
    new_urrl.alias = new_hash
    new_urrl.save
    return new_urrl.alias
  end
end
