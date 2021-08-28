import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '~/models/User';
import { SECRET_KEY } from './env';
import passport from 'passport';

passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: SECRET_KEY
		},
		async (jwtPayload, done) => {
			try {
				const user = await User.findById(jwtPayload.id).exec();

				if (!user) {
					return done(null, false);
				}

				return done(null, user);
			} catch (err) {
				return done(err, false);
			}
		}
	)
);

export default passport;
