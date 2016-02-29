require 'pg'
require 'active_record'

ActiveRecord::Base.establish_connection(
  :adapter => 'postgresql',
  :database => 'urrl'
)

if defined?(Sinatra)
  # fix issue where Active Record connections are left open by Sinatra
  after do
    ActiveRecord::Base.connection.close
  end
end
