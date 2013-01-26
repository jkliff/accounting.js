# TODO: make postgres restart AFTER the configuration files were reloaded
# TODO: remove user john

define add_user ( $uid, $groups ) {

    $username = $title

    user { $username:
        home    => "/home/$username",
        shell   => "/bin/bash",
        groups   => $groups,
        uid     => $uid,
    }

    group { $username:
        gid     => $uid,
        require => User[$username]
    }

    file { "/home/$username/":
        ensure  => directory,
        owner   => $username,
        group   => $username,
        mode    => 750,
        require => [ User[$username], Group[$username] ]
    }

    file { "/home/$username/.ssh":
        ensure  => directory,
        owner   => $username,
        group   => $username,
        mode    => 700,
        require => File["/home/$username/"]
    }

#            exec { "/narnia/tools/setuserpassword.sh $username":
#                    path            => "/bin:/usr/bin",
#                    refreshonly     => true,
#                    subscribe       => user[$username],
#                    unless          => "cat /etc/shadow | grep $username| cut -f 2 -d : | grep -v '!'"
#            }

    # now make sure that the ssh key authorized files is around
    file { "/home/$username/.ssh/authorized_keys":
        ensure  => present,
        owner   => $username,
        group   => $username,
        mode    => 600,
        require => File["/home/$username/"]
    }
}


define add_ssh_key( $key, $type ) {

   $username       = $title

   ssh_authorized_key{ "${username}_${key}":
      ensure  => present,
      key     => $key,
      type    => $type,
      user    => $username,
      require => File["/home/$username/.ssh/authorized_keys"]
   }
}


class accounting_js {
  exec { "apt_update":
    command => "apt-get update",
    path    => "/usr/bin"
  }

  package { "vim":
    ensure => present,
  }

  package { "postgresql-9.1":
    ensure => present,
  }

  package { "nodejs":
    ensure => present,
  }

  package { "python-psycopg2":
    ensure => present,
  }

  package { "python-yaml":
    ensure => present,
  }

  service { "postgresql":
    ensure => running,
    require => Package["postgresql-9.1"],
  }

  add_user { app_deployer:
    uid => 5666,
    groups => www-data,
  }

  add_ssh_key { app_deployer:
    key     => "AAAAB3NzaC1yc2EAAAADAQABAAABAQC95hM9btzYkVzvNiQjLnIqHTvEinRae5H0JABz+e70Dnh+XC+Uy5Hh0XW85zVDefhEJOBw55kMP4V3PUC3/M2MnAclxep/jU9x7UPLAFvynJ6h1NyUsDh9w7NeAkxP7jeWshcRVSbNtFJPHZMXAkFGhd70L33hsYMXDwVe11KJYsppoSF9cX4Bcx/gagZ0wLi8NXDHKLWohML46wkPH6Qxu6ntSircz7uoAKp31Egwd7pVLNAbkGbRfpBkicckDqMm2hnb2nsrkCvqPsukkZ+vXfJJDz8WLtIwH3BZMS2wPoUU00+XNssjkPbchZJOCaezDGk7g0hvjbBHutLFmeBb",
    type    => "ssh-rsa"
  }

  package { "git":
    ensure => present,
  }
}

# applicable to the development vm (see case statement at the end)
class accounting_js_dev inherits accounting_js {

  notice ('Using development configuration, will touch db config.')

  file { "/etc/postgresql/9.1/main/postgresql.conf":
    ensure => present,
    source => '/tmp/vagrant-puppet/modules-0/postgres/postgresql.conf',
    owner => postgres,
    group => postgres,
    require => Package["postgresql-9.1"],
  }

  file { "/etc/postgresql/9.1/main/pg_hba.conf":
    ensure => present,
    source => '/tmp/vagrant-puppet/modules-0/postgres/pg_hba.conf',
    owner => postgres,
    group => postgres,
    mode => 0640,
    require => Package["postgresql-9.1"],
  }

  file { "/home/app_deployer/.pgcrud":
    ensure => directory,
  }

  file { "/home/app_deployer/.pgcrud/profiles":
    ensure => present,
    source => '/tmp/vagrant-puppet/modules-0/pgcrud/profiles',
    owner => app_deployer,
    group => app_deployer,
    mode => 0640,
    require => File ["/home/app_deployer/.pgcrud"],
  }


  exec { "default_pg_password":
    command => "/usr/bin/sudo /bin/su postgres -c \"echo alter role postgres with password \\'postgres\\' | psql -U postgres\"",
    require => Service["postgresql"],
  }
}

# applies based on hostname
case $hostname {
    'accounting-dev':   {include accounting_js_dev }
    default:            {include accounting_js     }
}
