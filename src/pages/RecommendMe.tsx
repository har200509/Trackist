import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useUserMedia } from '@/hooks/useMedia'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { MediaCard } from '@/components/MediaCard'
import {
    Clock,
    Tv,
    Film,
    Gamepad2,
    Book,
    Sparkles,
    TrendingUp,
    Star,
    Calendar,
    Zap
} from 'lucide-react'
import { formatMediaType } from '@/lib/utils'

interface Recommendation {
    type: 'tv' | 'movie' | 'live_game' | 'book' | 'story_game'
    title: string
    description: string
    duration: string
    genre: string
    icon: any
    color: string
    examples: Array<{
        title: string
        description: string
        year?: number
        rating?: number
        genre?: string
        image?: string
    }>
}

export function RecommendMe() {
    const { userProfile } = useAuth()
    const [timeInput, setTimeInput] = useState('')
    const [timeInHours, setTimeInHours] = useState(0)
    const [recommendation, setRecommendation] = useState<Recommendation | null>(null)
    const [userGenres, setUserGenres] = useState<string[]>([])
    const [selectedGenre, setSelectedGenre] = useState<string>('')
    const [showGenreSelection, setShowGenreSelection] = useState(false)

    const { data: userMedia } = useUserMedia(userProfile?.id || '')

    // Analyze user's library to determine preferred genres
    useEffect(() => {
        if (userMedia && userMedia.length > 0) {
            const genreCount: Record<string, number> = {}

            userMedia.forEach(item => {
                if (item.media && item.media.genres) {
                    // genres is already an array from the database
                    const genres = item.media.genres

                    genres.forEach(genre => {
                        if (genre && typeof genre === 'string') {
                            const cleanGenre = genre.trim()
                            if (cleanGenre) {
                                genreCount[cleanGenre] = (genreCount[cleanGenre] || 0) + 1
                            }
                        }
                    })
                }
            })

            // Get top 3 genres, fallback to romantic if none
            const sortedGenres = Object.entries(genreCount)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([genre]) => genre)

            console.log('Genre analysis:', { genreCount, sortedGenres, userMedia: userMedia.length })
            setUserGenres(sortedGenres.length > 0 ? sortedGenres : ['Romance'])
        } else {
            console.log('No user media found, using default Romance genre')
            setUserGenres(['Romance'])
        }
    }, [userMedia])

    const parseTimeInput = (input: string) => {
        const cleanInput = input.toLowerCase().trim()
        let hours = 0

        if (cleanInput.includes('minute') || cleanInput.includes('min')) {
            const minutes = parseInt(cleanInput.match(/\d+/)?.[0] || '0')
            hours = minutes / 60
        } else if (cleanInput.includes('hour') || cleanInput.includes('hr')) {
            hours = parseInt(cleanInput.match(/\d+/)?.[0] || '0')
        } else if (cleanInput.includes('day')) {
            const days = parseInt(cleanInput.match(/\d+/)?.[0] || '0')
            hours = days * 24
        } else if (cleanInput.includes('week')) {
            const weeks = parseInt(cleanInput.match(/\d+/)?.[0] || '0')
            hours = weeks * 24 * 7
        } else {
            // Try to parse as number (assume hours)
            const num = parseFloat(cleanInput)
            if (!isNaN(num)) {
                hours = num
            }
        }

        return hours
    }

    const generateRecommendation = () => {
        const hours = parseTimeInput(timeInput)
        setTimeInHours(hours)

        if (hours === 0) {
            setRecommendation(null)
            return
        }

        let rec: Recommendation

        if (hours < 1.5) {
            // TV Series
            rec = {
                type: 'tv',
                title: 'TV Series',
                description: 'Perfect for a quick binge! TV episodes are ideal for shorter time slots.',
                duration: `${hours.toFixed(1)} hours`,
                genre: userGenres[0] || 'Romance',
                icon: Tv,
                color: 'from-blue-500 to-cyan-500',
                examples: [
                    {
                        title: 'Friends',
                        description: 'Follow the lives of six friends living in Manhattan as they navigate through life, love, and friendship.',
                        year: 1994,
                        rating: 8.9,
                        genre: 'Comedy, Romance'
                    },
                    {
                        title: 'The Office',
                        description: 'A mockumentary about a group of office workers where the workday consists of ego clashes, inappropriate behavior, and tedium.',
                        year: 2005,
                        rating: 8.9,
                        genre: 'Comedy'
                    },
                    {
                        title: 'Breaking Bad',
                        description: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine.',
                        year: 2008,
                        rating: 9.5,
                        genre: 'Drama, Crime'
                    },
                    {
                        title: 'Game of Thrones',
                        description: 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.',
                        year: 2011,
                        rating: 9.2,
                        genre: 'Fantasy, Drama'
                    },
                    {
                        title: 'Stranger Things',
                        description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces.',
                        year: 2016,
                        rating: 8.7,
                        genre: 'Sci-Fi, Horror'
                    },
                    {
                        title: 'The Walking Dead',
                        description: 'Sheriff Deputy Rick Grimes wakes up from a coma to learn the world is in ruins and must lead a group of survivors.',
                        year: 2010,
                        rating: 8.2,
                        genre: 'Horror, Thriller'
                    },
                    {
                        title: 'Sherlock',
                        description: 'A modern update finds the famous sleuth and his doctor partner solving crime in 21st century London.',
                        year: 2010,
                        rating: 9.1,
                        genre: 'Mystery, Crime'
                    },
                    {
                        title: 'The Crown',
                        description: 'Follows the political rivalries and romance of Queen Elizabeth II\'s reign and the events that shaped the second half of the 20th century.',
                        year: 2016,
                        rating: 8.6,
                        genre: 'Drama, Biography'
                    },
                    // Additional examples for more genres
                    { title: '24', description: 'Counter-terrorism agent Jack Bauer races against time to prevent terrorist attacks.', year: 2001, rating: 8.3, genre: 'Action' },
                    { title: 'Arrow', description: 'Billionaire playboy Oliver Queen becomes a vigilante archer to fight crime in Starling City.', year: 2012, rating: 7.5, genre: 'Action' },
                    { title: 'The Boys', description: 'A group of vigilantes set out to take down corrupt superheroes who abuse their superpowers.', year: 2019, rating: 8.7, genre: 'Action' },
                    { title: 'Daredevil', description: 'A blind lawyer by day, vigilante by night fights crime in Hell\'s Kitchen.', year: 2015, rating: 8.6, genre: 'Action' },
                    { title: 'Lost', description: 'Survivors of a plane crash are stranded on a mysterious island with supernatural elements.', year: 2004, rating: 8.3, genre: 'Adventure' },
                    { title: 'The Mandalorian', description: 'A lone bounty hunter navigates the outer reaches of the galaxy.', year: 2019, rating: 8.7, genre: 'Adventure' },
                    { title: 'Outlander', description: 'A World War II nurse is mysteriously transported back to 18th century Scotland.', year: 2014, rating: 8.4, genre: 'Adventure' },
                    { title: 'Vikings', description: 'The adventures of Ragnar Lothbrok, the greatest hero of his age.', year: 2013, rating: 8.5, genre: 'Adventure' },
                    { title: 'Brooklyn Nine-Nine', description: 'Comedy series following the exploits of Det. Jake Peralta and his diverse, lovable colleagues.', year: 2013, rating: 8.4, genre: 'Comedy' },
                    { title: 'Modern Family', description: 'Three different but related families face trials and tribulations in their own uniquely comedic ways.', year: 2009, rating: 8.4, genre: 'Comedy' },
                    { title: 'This Is Us', description: 'The story of the Pearson family across different decades of their lives.', year: 2016, rating: 8.7, genre: 'Drama' },
                    { title: 'Mad Men', description: 'A drama about one of New York\'s most prestigious ad agencies at the beginning of the 1960s.', year: 2007, rating: 8.6, genre: 'Drama' },
                    { title: 'Bridgerton', description: 'The eight close-knit siblings of the Bridgerton family look for love and happiness in London high society.', year: 2020, rating: 7.3, genre: 'Romance' },
                    { title: 'True Detective', description: 'Seasonal anthology series in which police investigations unearth the personal and professional secrets of those involved.', year: 2014, rating: 9.0, genre: 'Crime' },
                    { title: 'Mindhunter', description: 'Set in the late 1970s, two FBI agents are tasked with interviewing serial killers to solve open cases.', year: 2017, rating: 8.6, genre: 'Crime' },
                    { title: 'Black Mirror', description: 'An anthology series exploring a twisted, high-tech multiverse where humanity\'s greatest innovations and darkest instincts collide.', year: 2011, rating: 8.8, genre: 'Sci-Fi' },
                    { title: 'The Expanse', description: 'A thriller set two hundred years in the future following the case of a missing young woman.', year: 2015, rating: 8.5, genre: 'Sci-Fi' },
                    { title: 'Ozark', description: 'A financial advisor drags his family from Chicago to the Missouri Ozarks, where he must launder money to appease a Mexican cartel.', year: 2017, rating: 8.2, genre: 'Thriller' },
                    { title: 'The Witcher', description: 'Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.', year: 2019, rating: 8.2, genre: 'Fantasy' },
                    { title: 'Shadow and Bone', description: 'Dark forces conspire against orphan mapmaker Alina Starkov when she unleashes an extraordinary power.', year: 2021, rating: 7.6, genre: 'Fantasy' },
                    { title: 'American Horror Story', description: 'An anthology series centering on different characters and locations, including a house with a murderous past.', year: 2011, rating: 8.0, genre: 'Horror' },
                    { title: 'The Haunting of Hill House', description: 'Flashing between past and present, a fractured family confronts haunting memories of their old home.', year: 2018, rating: 8.6, genre: 'Horror' },
                    { title: 'Broadchurch', description: 'The murder of a young boy in a small coastal town brings a media frenzy, which threatens to tear the community apart.', year: 2013, rating: 8.4, genre: 'Mystery' },
                    { title: 'The Simpsons', description: 'The satiric adventures of a working-class family in the misfit city of Springfield.', year: 1989, rating: 8.7, genre: 'Family' },
                    { title: 'Full House', description: 'A widowed father enlists his best friend and brother-in-law to help raise his three daughters.', year: 1987, rating: 7.4, genre: 'Family' },
                    { title: 'The Fresh Prince of Bel-Air', description: 'A street-smart teenager from Philadelphia is sent to live with his wealthy uncle and aunt in Bel-Air.', year: 1990, rating: 8.0, genre: 'Family' },
                    { title: 'South Park', description: 'Follows the misadventures of four irreverent grade-schoolers in the quiet, dysfunctional town of South Park, Colorado.', year: 1997, rating: 8.7, genre: 'Animation' },
                    { title: 'Rick and Morty', description: 'An animated series that follows the exploits of a super scientist and his not-so-bright grandson.', year: 2013, rating: 9.1, genre: 'Animation' },
                    { title: 'Avatar: The Last Airbender', description: 'In a war-torn world of elemental magic, a young boy reawakens to undertake a dangerous mystic quest.', year: 2005, rating: 9.3, genre: 'Animation' },
                    { title: 'Planet Earth', description: 'A nature documentary series that showcases the natural world and the challenges faced by living creatures.', year: 2006, rating: 9.4, genre: 'Documentary' },
                    { title: 'Making a Murderer', description: 'Filmed over 10 years, this real-life thriller follows a DNA exoneree who, while exposing police corruption, becomes a suspect in a grisly new crime.', year: 2015, rating: 8.6, genre: 'Documentary' },
                    { title: 'Tiger King', description: 'A zoo owner spirals out of control amid a cast of eccentric characters in this true murder-for-hire story.', year: 2020, rating: 7.6, genre: 'Documentary' },
                    { title: 'The Last Dance', description: 'A 10-part documentary chronicling the untold story of Michael Jordan and the Chicago Bulls dynasty.', year: 2020, rating: 9.1, genre: 'Documentary' },
                    { title: 'Glee', description: 'A group of ambitious misfits try to escape the harsh realities of high school by joining a glee club.', year: 2009, rating: 6.7, genre: 'Musical' },
                    { title: 'High School Musical: The Musical: The Series', description: 'A mockumentary series that follows a group of students at East High School as they put on a production of High School Musical.', year: 2019, rating: 7.2, genre: 'Musical' },
                    { title: 'Crazy Ex-Girlfriend', description: 'A young woman abandons her successful career and a chance at love to chase her childhood ex-boyfriend.', year: 2015, rating: 7.8, genre: 'Musical' },
                    { title: 'Zoey\'s Extraordinary Playlist', description: 'A young woman discovers she has the ability to hear the innermost thoughts of people around her as songs and musical numbers.', year: 2020, rating: 8.1, genre: 'Musical' },
                    { title: 'Deadwood', description: 'A show set in the late 1800s, revolving around the characters of Deadwood, South Dakota.', year: 2004, rating: 8.7, genre: 'Western' },
                    { title: 'Hell on Wheels', description: 'A post-Civil War Western about a former Confederate soldier who works on the construction of the First Transcontinental Railroad.', year: 2011, rating: 8.2, genre: 'Western' },
                    { title: 'Longmire', description: 'Walt Longmire is the dedicated and unflappable sheriff of Absaroka County, Wyoming.', year: 2012, rating: 8.3, genre: 'Western' },
                    { title: 'Godless', description: 'A ruthless outlaw terrorizes the West in search of a former member of his gang, who\'s found a new life in a quiet town populated only by women.', year: 2017, rating: 8.3, genre: 'Western' },
                    { title: 'Band of Brothers', description: 'The story of Easy Company of the U.S. Army 101st Airborne Division and their mission in World War II Europe.', year: 2001, rating: 9.4, genre: 'War' },
                    { title: 'The Pacific', description: 'The Pacific Theatre of World War II, as seen through the eyes of several young Marines.', year: 2010, rating: 8.3, genre: 'War' },
                    { title: 'Generation Kill', description: 'A seven-part miniseries that tells the story of the first 40 days of the Iraq war from the perspective of the Marines.', year: 2008, rating: 8.7, genre: 'War' },
                    { title: 'M*A*S*H', description: 'The staff of a Korean War field hospital use humor and hijinks to keep their sanity in the face of the horror of war.', year: 1972, rating: 8.4, genre: 'War' },
                    { title: 'Narcos', description: 'A chronicled look at the criminal exploits of Colombian drug lord Pablo Escobar.', year: 2015, rating: 8.8, genre: 'Biography' },
                    { title: 'The People v. O. J. Simpson', description: 'An exploration of the O.J. Simpson trial told from the perspective of the lawyers.', year: 2016, rating: 8.4, genre: 'Biography' },
                    { title: 'Chernobyl', description: 'In April 1986, an explosion at the Chernobyl nuclear power plant in the Union of Soviet Socialist Republics becomes one of the world\'s worst man-made catastrophes.', year: 2019, rating: 9.4, genre: 'Biography' }
                ]
            }
        } else if (hours >= 1.5 && hours < 4) {
            // Movie
            rec = {
                type: 'movie',
                title: 'Movie',
                description: 'Great choice! Movies fit perfectly in this time frame.',
                duration: `${hours.toFixed(1)} hours`,
                genre: userGenres[0] || 'Romance',
                icon: Film,
                color: 'from-purple-500 to-pink-500',
                examples: [
                    {
                        title: 'The Shawshank Redemption',
                        description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
                        year: 1994,
                        rating: 9.3,
                        genre: 'Drama'
                    },
                    {
                        title: 'Inception',
                        description: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into a CEO\'s mind.',
                        year: 2010,
                        rating: 8.8,
                        genre: 'Action, Sci-Fi, Thriller'
                    },
                    {
                        title: 'Pulp Fiction',
                        description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
                        year: 1994,
                        rating: 8.9,
                        genre: 'Crime, Drama'
                    },
                    {
                        title: 'The Dark Knight',
                        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
                        year: 2008,
                        rating: 9.0,
                        genre: 'Action, Crime, Drama'
                    },
                    {
                        title: 'Titanic',
                        description: 'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.',
                        year: 1997,
                        rating: 7.8,
                        genre: 'Romance, Drama'
                    },
                    {
                        title: 'The Matrix',
                        description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
                        year: 1999,
                        rating: 8.7,
                        genre: 'Sci-Fi, Action'
                    },
                    {
                        title: 'The Lord of the Rings: The Fellowship of the Ring',
                        description: 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring.',
                        year: 2001,
                        rating: 8.8,
                        genre: 'Fantasy, Adventure'
                    },
                    {
                        title: 'The Godfather',
                        description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
                        year: 1972,
                        rating: 9.2,
                        genre: 'Crime, Drama'
                    },
                    {
                        title: 'Toy Story',
                        description: 'A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy\'s room.',
                        year: 1995,
                        rating: 8.3,
                        genre: 'Animation, Family'
                    },
                    {
                        title: 'The Silence of the Lambs',
                        description: 'A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.',
                        year: 1991,
                        rating: 8.6,
                        genre: 'Thriller, Horror'
                    },
                    // Action
                    { title: 'Die Hard', description: 'A New York City police officer tries to save his wife and others taken hostage by terrorists.', year: 1988, rating: 8.2, genre: 'Action' },
                    { title: 'Mad Max: Fury Road', description: 'In a post-apocalyptic wasteland, Max teams up with Furiosa to escape a tyrannical warlord.', year: 2015, rating: 8.1, genre: 'Action' },
                    { title: 'John Wick', description: 'An ex-hit-man comes out of retirement to track down the gangsters that took everything from him.', year: 2014, rating: 7.4, genre: 'Action' },
                    { title: 'Mission: Impossible', description: 'An American agent must discover and expose the real spy without the help of his organization.', year: 1996, rating: 7.1, genre: 'Action' },
                    // Adventure
                    { title: 'Indiana Jones and the Raiders of the Lost Ark', description: 'Archaeologist Indiana Jones races to find the Ark of the Covenant before the Nazis.', year: 1981, rating: 8.4, genre: 'Adventure' },
                    { title: 'Jurassic Park', description: 'A paleontologist must protect kids after cloned dinosaurs run loose in a theme park.', year: 1993, rating: 8.1, genre: 'Adventure' },
                    { title: 'The Goonies', description: 'A group of young misfits discover an ancient map and set out to find a legendary pirate\'s treasure.', year: 1985, rating: 7.8, genre: 'Adventure' },
                    { title: 'Back to the Future', description: 'A teenager is accidentally sent thirty years into the past in a time-traveling DeLorean.', year: 1985, rating: 8.5, genre: 'Adventure' },
                    // More Comedy
                    { title: 'Superbad', description: 'Two high school seniors deal with separation anxiety after their booze-soaked party plan goes awry.', year: 2007, rating: 7.6, genre: 'Comedy' },
                    { title: 'The Hangover', description: 'Three buddies wake up from a bachelor party with no memory and the bachelor missing.', year: 2009, rating: 7.7, genre: 'Comedy' },
                    { title: 'Anchorman', description: 'Ron Burgundy\'s male-dominated broadcasting world changes when an ambitious woman is hired.', year: 2004, rating: 7.2, genre: 'Comedy' },
                    { title: 'Dumb and Dumber', description: 'The cross-country adventures of two good-hearted but incredibly stupid friends.', year: 1994, rating: 7.3, genre: 'Comedy' },
                    // More Romance
                    { title: 'Casablanca', description: 'A cafe owner struggles to help his former lover and her fugitive husband escape the Nazis.', year: 1942, rating: 8.5, genre: 'Romance' },
                    { title: 'When Harry Met Sally', description: 'Harry and Sally are good friends, but they fear sex would ruin the friendship.', year: 1989, rating: 7.6, genre: 'Romance' },
                    { title: 'The Notebook', description: 'A poor young man falls in love with a rich young woman despite their social differences.', year: 2004, rating: 7.8, genre: 'Romance' },
                    { title: 'Pretty Woman', description: 'A man hires a beautiful prostitute for social events, only to fall in love.', year: 1990, rating: 7.0, genre: 'Romance' },
                    // More Horror
                    { title: 'The Exorcist', description: 'A mother seeks help from two priests to save her possessed 12-year-old daughter.', year: 1973, rating: 8.0, genre: 'Horror' },
                    { title: 'Halloween', description: 'Michael Myers escapes from a mental hospital and returns to kill again on Halloween.', year: 1978, rating: 7.7, genre: 'Horror' },
                    { title: 'A Nightmare on Elm Street', description: 'A slain janitor seeks revenge by invading the dreams of teenagers.', year: 1984, rating: 7.4, genre: 'Horror' },
                    { title: 'The Shining', description: 'A sinister presence influences a father into violence at an isolated hotel.', year: 1980, rating: 8.4, genre: 'Horror' },
                    // Mystery
                    { title: 'Chinatown', description: 'A private detective gets caught up in a web of deceit, corruption and murder.', year: 1974, rating: 8.2, genre: 'Mystery' },
                    { title: 'The Maltese Falcon', description: 'A private detective takes on a case involving criminals and their quest for a priceless statuette.', year: 1941, rating: 8.0, genre: 'Mystery' },
                    { title: 'Vertigo', description: 'A former police detective becomes obsessed with a hauntingly beautiful woman.', year: 1958, rating: 8.3, genre: 'Mystery' },
                    { title: 'Rear Window', description: 'A wheelchair-bound photographer spies on his neighbors and becomes convinced one committed murder.', year: 1954, rating: 8.5, genre: 'Mystery' },
                    // Family
                    { title: 'The Lion King', description: 'Lion prince Simba and his father are targeted by his bitter uncle.', year: 1994, rating: 8.5, genre: 'Family' },
                    { title: 'Finding Nemo', description: 'A timid clownfish sets out to bring his captured son home from Sydney.', year: 2003, rating: 8.1, genre: 'Family' },
                    { title: 'E.T. the Extra-Terrestrial', description: 'A troubled child helps a friendly alien escape Earth and return home.', year: 1982, rating: 7.8, genre: 'Family' },
                    { title: 'Home Alone', description: 'An eight-year-old must protect his house from burglars when accidentally left home alone.', year: 1990, rating: 7.6, genre: 'Family' },
                    // Animation
                    { title: 'Spirited Away', description: 'A girl wanders into a world ruled by witches and spirits where humans are changed into beasts.', year: 2001, rating: 8.6, genre: 'Animation' },
                    { title: 'Wall-E', description: 'A waste-collecting robot embarks on a space journey that will decide the fate of mankind.', year: 2008, rating: 8.4, genre: 'Animation' },
                    { title: 'Up', description: '78-year-old Carl travels to Paradise Falls in his balloon-equipped house with a young stowaway.', year: 2009, rating: 8.2, genre: 'Animation' },
                    { title: 'Your Name', description: 'Two teenagers share a magical connection upon discovering they are swapping bodies.', year: 2016, rating: 8.2, genre: 'Animation' },
                    // Documentary
                    { title: 'March of the Penguins', description: 'The annual journey of Emperor penguins to their traditional breeding ground.', year: 2005, rating: 7.5, genre: 'Documentary' },
                    { title: 'Bowling for Columbine', description: 'Michael Moore explores the roots of America\'s predilection for gun violence.', year: 2002, rating: 7.9, genre: 'Documentary' },
                    { title: 'An Inconvenient Truth', description: 'Al Gore campaigns to raise awareness of global warming dangers.', year: 2006, rating: 7.4, genre: 'Documentary' },
                    { title: 'Super Size Me', description: 'Morgan Spurlock explores the consequences of a diet of solely McDonald\'s food for one month.', year: 2004, rating: 7.2, genre: 'Documentary' },
                    // Musical
                    { title: 'La La Land', description: 'A pianist and actress fall in love while attempting to reconcile their aspirations in Los Angeles.', year: 2016, rating: 8.0, genre: 'Musical' },
                    { title: 'The Sound of Music', description: 'A woman becomes governess to the children of a Naval officer widower.', year: 1965, rating: 8.0, genre: 'Musical' },
                    { title: 'Singin\' in the Rain', description: 'A silent film production company makes a difficult transition to sound.', year: 1952, rating: 8.3, genre: 'Musical' },
                    { title: 'Moulin Rouge!', description: 'A poet falls for a beautiful courtesan whom a jealous duke covets.', year: 2001, rating: 7.6, genre: 'Musical' },
                    // Western
                    { title: 'The Good, the Bad and the Ugly', description: 'A bounty hunting scam joins two men in an uneasy alliance against a third.', year: 1966, rating: 8.8, genre: 'Western' },
                    { title: 'Unforgiven', description: 'Retired gunslinger William Munny takes on one last job with his old partner.', year: 1992, rating: 8.2, genre: 'Western' },
                    { title: 'Django Unchained', description: 'A freed slave sets out to rescue his wife from a brutal plantation owner.', year: 2012, rating: 8.4, genre: 'Western' },
                    { title: 'True Grit', description: 'A stubborn teenager enlists a tough U.S. Marshal to track down her father\'s murderer.', year: 2010, rating: 7.6, genre: 'Western' },
                    // War
                    { title: 'Saving Private Ryan', description: 'U.S. soldiers go behind enemy lines to retrieve a paratrooper whose brothers were killed.', year: 1998, rating: 8.6, genre: 'War' },
                    { title: 'Apocalypse Now', description: 'A U.S. Army officer is tasked with assassinating a renegade Special Forces Colonel in Vietnam.', year: 1979, rating: 8.4, genre: 'War' },
                    { title: 'Full Metal Jacket', description: 'A Marine observes the dehumanizing effects of the Vietnam War on fellow recruits.', year: 1987, rating: 8.3, genre: 'War' },
                    { title: 'Platoon', description: 'A recruit in Vietnam finds himself caught between two sergeants, one good and the other evil.', year: 1986, rating: 8.1, genre: 'War' },
                    // Biography
                    { title: 'The Social Network', description: 'Mark Zuckerberg creates Facebook while being sued by twins and his co-founder.', year: 2010, rating: 7.7, genre: 'Biography' },
                    { title: 'A Beautiful Mind', description: 'Mathematician John Nash accepts secret cryptography work and his life turns nightmarish.', year: 2001, rating: 8.2, genre: 'Biography' },
                    { title: 'The King\'s Speech', description: 'King George VI overcomes his stammer with help from a speech therapist.', year: 2010, rating: 8.0, genre: 'Biography' },
                    { title: 'Malcolm X', description: 'The life of the controversial Black Nationalist leader from gangster to minister.', year: 1992, rating: 7.7, genre: 'Biography' }
                ]
            }
        } else if (hours >= 4 && hours < 24) {
            // Live Service Game
            rec = {
                type: 'live_game',
                title: 'Live Service Game',
                description: 'Perfect for extended gaming sessions! These games offer continuous entertainment.',
                duration: `${hours.toFixed(1)} hours`,
                genre: 'Action',
                icon: Gamepad2,
                color: 'from-green-500 to-emerald-500',
                examples: [
                    {
                        title: 'Fortnite',
                        description: 'Battle royale game where 100 players fight to be the last person standing, featuring building mechanics and regular content updates.',
                        year: 2017,
                        rating: 4.5,
                        genre: 'Battle Royale, Action'
                    },
                    {
                        title: 'Call of Duty: Warzone',
                        description: 'Free-to-play battle royale game set in the Call of Duty universe, featuring large-scale combat and tactical gameplay.',
                        year: 2020,
                        rating: 4.2,
                        genre: 'Battle Royale, FPS'
                    },
                    {
                        title: 'PUBG',
                        description: 'PlayerUnknown\'s Battlegrounds is a battle royale game where players fight to be the last one standing on an island.',
                        year: 2017,
                        rating: 4.1,
                        genre: 'Battle Royale, Survival'
                    },
                    {
                        title: 'Valorant',
                        description: 'Tactical first-person shooter featuring character-based abilities and precise gunplay in competitive matches.',
                        year: 2020,
                        rating: 4.3,
                        genre: 'FPS, Tactical'
                    },
                    {
                        title: 'Apex Legends',
                        description: 'Free-to-play battle royale game featuring unique characters with special abilities and fast-paced combat.',
                        year: 2019,
                        rating: 4.4,
                        genre: 'Battle Royale, Hero Shooter'
                    },
                    {
                        title: 'League of Legends',
                        description: 'Multiplayer online battle arena game where two teams of five champions battle to destroy the enemy\'s base.',
                        year: 2009,
                        rating: 4.2,
                        genre: 'Strategy, Action'
                    },
                    {
                        title: 'Counter-Strike 2',
                        description: 'Tactical first-person shooter where terrorists and counter-terrorists compete in objective-based game modes.',
                        year: 2023,
                        rating: 4.1,
                        genre: 'FPS, Tactical'
                    },
                    {
                        title: 'Rocket League',
                        description: 'Vehicular soccer video game where players control rocket-powered cars to hit a ball into the opponent\'s goal.',
                        year: 2015,
                        rating: 4.6,
                        genre: 'Sports, Racing'
                    },
                    {
                        title: 'Among Us',
                        description: 'Online multiplayer social deduction game where players work together to find impostors among the crew.',
                        year: 2018,
                        rating: 4.0,
                        genre: 'Puzzle, Strategy'
                    },
                    {
                        title: 'Minecraft',
                        description: 'Sandbox game where players can build, explore, and survive in a blocky, procedurally generated world.',
                        year: 2011,
                        rating: 4.7,
                        genre: 'Simulation, Adventure'
                    },
                    // FPS
                    { title: 'Counter-Strike: Global Offensive', description: 'Competitive tactical FPS where two teams compete in objective-based rounds.', year: 2012, rating: 4.3, genre: 'FPS' },
                    { title: 'Overwatch 2', description: 'Team-based hero shooter with unique characters and abilities.', year: 2022, rating: 4.1, genre: 'FPS' },
                    { title: 'Destiny 2', description: 'Online multiplayer FPS with RPG elements and cooperative gameplay.', year: 2017, rating: 4.2, genre: 'FPS' },
                    { title: 'Valorant', description: 'Tactical FPS combining precise gunplay with unique agent abilities.', year: 2020, rating: 4.4, genre: 'FPS' },
                    // Battle Royale
                    { title: 'Apex Legends', description: 'Fast-paced battle royale with unique characters and abilities.', year: 2019, rating: 4.3, genre: 'Battle Royale' },
                    { title: 'PlayerUnknown\'s Battlegrounds', description: 'The battle royale that started the genre, featuring realistic combat.', year: 2017, rating: 4.0, genre: 'Battle Royale' },
                    { title: 'Fall Guys', description: 'Colorful battle royale party game with obstacle courses and mini-games.', year: 2020, rating: 4.2, genre: 'Battle Royale' },
                    { title: 'Warzone', description: 'Large-scale battle royale set in the Call of Duty universe.', year: 2020, rating: 4.1, genre: 'Battle Royale' },
                    // Tactical
                    { title: 'Rainbow Six Siege', description: 'Tactical FPS focused on environmental destruction and team strategy.', year: 2015, rating: 4.5, genre: 'Tactical' },
                    { title: 'Squad', description: 'Large-scale tactical FPS emphasizing teamwork and communication.', year: 2020, rating: 4.3, genre: 'Tactical' },
                    { title: 'Hell Let Loose', description: 'Realistic WWII tactical shooter with large-scale battles.', year: 2021, rating: 4.4, genre: 'Tactical' },
                    { title: 'Insurgency: Sandstorm', description: 'Realistic tactical FPS set in modern conflict zones.', year: 2018, rating: 4.2, genre: 'Tactical' },
                    // Survival
                    { title: 'Rust', description: 'Multiplayer survival game where players must gather resources and build bases.', year: 2018, rating: 4.1, genre: 'Survival' },
                    { title: 'DayZ', description: 'Post-apocalyptic survival game where players must survive zombies and other players.', year: 2018, rating: 3.9, genre: 'Survival' },
                    { title: 'The Forest', description: 'Survival horror game where players must survive on a cannibal-infested island.', year: 2018, rating: 4.3, genre: 'Survival' },
                    { title: 'Green Hell', description: 'Psychological survival game set in the Amazon rainforest.', year: 2019, rating: 4.2, genre: 'Survival' },
                    // Strategy
                    { title: 'Age of Empires IV', description: 'Real-time strategy game featuring historical civilizations and warfare.', year: 2021, rating: 4.4, genre: 'Strategy' },
                    { title: 'Civilization VI', description: 'Turn-based strategy game where players build and manage civilizations.', year: 2016, rating: 4.6, genre: 'Strategy' },
                    { title: 'StarCraft II', description: 'Fast-paced real-time strategy game with competitive multiplayer.', year: 2010, rating: 4.7, genre: 'Strategy' },
                    { title: 'Total War: Warhammer III', description: 'Grand strategy game combining turn-based campaign with real-time battles.', year: 2022, rating: 4.3, genre: 'Strategy' }
                ]
            }
        } else if (hours >= 24 && hours < 48) {
            // Book
            rec = {
                type: 'book',
                title: 'Book',
                description: 'Excellent! Books are perfect for longer, more immersive experiences.',
                duration: `${(hours / 24).toFixed(1)} days`,
                genre: userGenres[0] || 'Romance',
                icon: Book,
                color: 'from-amber-500 to-orange-500',
                examples: [
                    {
                        title: 'The Great Gatsby',
                        description: 'A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream through the eyes of Nick Carraway.',
                        year: 1925,
                        rating: 4.5,
                        genre: 'Fiction, Classic'
                    },
                    {
                        title: 'To Kill a Mockingbird',
                        description: 'A gripping tale of racial injustice and childhood innocence in the American South, told through the eyes of Scout Finch.',
                        year: 1960,
                        rating: 4.6,
                        genre: 'Fiction, Classic'
                    },
                    {
                        title: '1984',
                        description: 'A dystopian novel about totalitarian control, surveillance, and the power of language in a society where independent thinking is a crime.',
                        year: 1949,
                        rating: 4.4,
                        genre: 'Dystopian, Fiction'
                    },
                    {
                        title: 'Pride and Prejudice',
                        description: 'A romantic novel about Elizabeth Bennet and Mr. Darcy, exploring themes of love, class, and social expectations in Regency England.',
                        year: 1813,
                        rating: 4.5,
                        genre: 'Romance, Classic'
                    },
                    {
                        title: 'The Catcher in the Rye',
                        description: 'A coming-of-age story following Holden Caulfield as he navigates teenage rebellion and alienation in New York City.',
                        year: 1951,
                        rating: 4.2,
                        genre: 'Fiction, Classic'
                    },
                    {
                        title: 'The Hobbit',
                        description: 'A fantasy novel about Bilbo Baggins, a hobbit who goes on an unexpected adventure with a group of dwarves.',
                        year: 1937,
                        rating: 4.7,
                        genre: 'Fantasy, Adventure'
                    },
                    {
                        title: 'The Diary of a Young Girl',
                        description: 'The diary of Anne Frank, a Jewish girl hiding from the Nazis during World War II, documenting her thoughts and experiences.',
                        year: 1947,
                        rating: 4.8,
                        genre: 'Biography, History'
                    },
                    {
                        title: 'The Alchemist',
                        description: 'A philosophical novel about a young Andalusian shepherd who travels from Spain to Egypt in search of treasure.',
                        year: 1988,
                        rating: 4.3,
                        genre: 'Philosophy, Fiction'
                    },
                    {
                        title: 'Atomic Habits',
                        description: 'A practical guide to building good habits and breaking bad ones, with actionable strategies for personal improvement.',
                        year: 2018,
                        rating: 4.6,
                        genre: 'Self-Help, Philosophy'
                    },
                    {
                        title: 'Sapiens',
                        description: 'An exploration of how Homo sapiens came to dominate the world, examining the cognitive, agricultural, and scientific revolutions.',
                        year: 2011,
                        rating: 4.5,
                        genre: 'History, Philosophy'
                    },
                    // Fiction
                    { title: 'The Lord of the Rings', description: 'An epic fantasy novel following Frodo Baggins on his quest to destroy the One Ring.', year: 1954, rating: 4.8, genre: 'Fiction' },
                    { title: 'The Handmaid\'s Tale', description: 'A dystopian novel about a totalitarian society where women are subjugated.', year: 1985, rating: 4.6, genre: 'Fiction' },
                    { title: 'The Kite Runner', description: 'A story of friendship and redemption set in Afghanistan.', year: 2003, rating: 4.5, genre: 'Fiction' },
                    { title: 'The Book Thief', description: 'A girl in Nazi Germany who steals books and shares them with others.', year: 2005, rating: 4.7, genre: 'Fiction' },
                    // Non-Fiction
                    { title: 'Educated', description: 'A memoir about escaping a survivalist family to earn a PhD from Cambridge.', year: 2018, rating: 4.8, genre: 'Non-Fiction' },
                    { title: 'Thinking, Fast and Slow', description: 'An overview of the two systems that drive how we think and make decisions.', year: 2011, rating: 4.5, genre: 'Non-Fiction' },
                    { title: 'The Immortal Life of Henrietta Lacks', description: 'How one woman\'s cells revolutionized medical research.', year: 2010, rating: 4.6, genre: 'Non-Fiction' },
                    { title: 'Sapiens', description: 'A brief history of humankind and how we came to dominate the world.', year: 2011, rating: 4.7, genre: 'Non-Fiction' },
                    // Romance
                    { title: 'Me Before You', description: 'A caregiver\'s relationship with a paralyzed man changes both their lives.', year: 2012, rating: 4.4, genre: 'Romance' },
                    { title: 'The Time Traveler\'s Wife', description: 'A unique love story about a man who involuntarily time travels.', year: 2003, rating: 4.2, genre: 'Romance' },
                    { title: 'The Seven Husbands of Evelyn Hugo', description: 'A reclusive Hollywood icon tells her life story.', year: 2017, rating: 4.6, genre: 'Romance' },
                    { title: 'Red, White & Royal Blue', description: 'The First Son falls in love with the Prince of Wales.', year: 2019, rating: 4.5, genre: 'Romance' },
                    // Mystery
                    { title: 'The Girl with the Dragon Tattoo', description: 'A journalist and computer hacker investigate a decades-old disappearance.', year: 2005, rating: 4.4, genre: 'Mystery' },
                    { title: 'Gone Girl', description: 'A psychological thriller about a marriage gone wrong when Amy Dunne disappears.', year: 2012, rating: 4.3, genre: 'Mystery' },
                    { title: 'The Da Vinci Code', description: 'A symbologist and cryptologist race to solve a murder and uncover a conspiracy.', year: 2003, rating: 4.1, genre: 'Mystery' },
                    { title: 'The Silent Patient', description: 'A psychotherapist becomes obsessed with a patient who refuses to speak.', year: 2019, rating: 4.5, genre: 'Mystery' },
                    // Thriller
                    { title: 'The Girl on the Train', description: 'A psychological thriller about a woman who becomes entangled in a missing person investigation.', year: 2015, rating: 4.2, genre: 'Thriller' },
                    { title: 'The Woman in the Window', description: 'An agoraphobic woman witnesses a crime in her neighbor\'s house.', year: 2018, rating: 4.0, genre: 'Thriller' },
                    { title: 'Sharp Objects', description: 'A journalist returns to her hometown to cover murders and confronts her past.', year: 2006, rating: 4.3, genre: 'Thriller' },
                    { title: 'The Silent Wife', description: 'A psychological thriller about a marriage that slowly unravels into violence.', year: 2013, rating: 4.1, genre: 'Thriller' },
                    // Fantasy
                    { title: 'The Name of the Wind', description: 'The first book in the Kingkiller Chronicle, following Kvothe\'s life story.', year: 2007, rating: 4.7, genre: 'Fantasy' },
                    { title: 'A Game of Thrones', description: 'The first book in A Song of Ice and Fire, featuring political intrigue.', year: 1996, rating: 4.6, genre: 'Fantasy' },
                    { title: 'The Wheel of Time', description: 'An epic fantasy series following Rand al\'Thor as the Dragon Reborn.', year: 1990, rating: 4.5, genre: 'Fantasy' },
                    { title: 'Mistborn', description: 'A fantasy novel set in a world where the Dark Lord has won.', year: 2006, rating: 4.6, genre: 'Fantasy' },
                    // Sci-Fi
                    { title: 'Dune', description: 'An epic science fiction novel set on the desert planet Arrakis.', year: 1965, rating: 4.8, genre: 'Sci-Fi' },
                    { title: 'The Martian', description: 'An astronaut is stranded on Mars and must use his ingenuity to survive.', year: 2011, rating: 4.7, genre: 'Sci-Fi' },
                    { title: 'Foundation', description: 'A science fiction series about psychohistory and galactic civilizations.', year: 1951, rating: 4.6, genre: 'Sci-Fi' },
                    { title: 'The Left Hand of Darkness', description: 'A science fiction novel exploring themes of gender and politics.', year: 1969, rating: 4.4, genre: 'Sci-Fi' },
                    // Horror
                    { title: 'The Shining', description: 'A horror novel about a writer who becomes the caretaker of an isolated hotel.', year: 1977, rating: 4.5, genre: 'Horror' },
                    { title: 'It', description: 'A group of children must face their fears and battle an ancient evil.', year: 1986, rating: 4.6, genre: 'Horror' },
                    { title: 'The Exorcist', description: 'A horror novel about a young girl possessed by a demon.', year: 1971, rating: 4.4, genre: 'Horror' },
                    { title: 'Pet Sematary', description: 'A horror novel about a family who discovers a mysterious burial ground.', year: 1983, rating: 4.3, genre: 'Horror' },
                    // Biography
                    { title: 'Steve Jobs', description: 'A comprehensive biography of Apple co-founder Steve Jobs.', year: 2011, rating: 4.6, genre: 'Biography' },
                    { title: 'Becoming', description: 'Michelle Obama\'s memoir covering her life from childhood to First Lady.', year: 2018, rating: 4.8, genre: 'Biography' },
                    { title: 'The Diary of a Young Girl', description: 'The diary of Anne Frank, a Jewish girl who hid from the Nazis.', year: 1947, rating: 4.7, genre: 'Biography' },
                    { title: 'Long Walk to Freedom', description: 'Nelson Mandela\'s autobiography covering his life and presidency.', year: 1994, rating: 4.8, genre: 'Biography' },
                    // History
                    { title: 'The Guns of August', description: 'A detailed account of the first month of World War I.', year: 1962, rating: 4.6, genre: 'History' },
                    { title: 'The Rise and Fall of the Third Reich', description: 'A comprehensive history of Nazi Germany.', year: 1960, rating: 4.8, genre: 'History' },
                    { title: 'A People\'s History of the United States', description: 'A history of the United States from the perspective of ordinary people.', year: 1980, rating: 4.5, genre: 'History' },
                    { title: 'The Silk Roads', description: 'A history of the world through the lens of the Silk Roads.', year: 2015, rating: 4.4, genre: 'History' },
                    // Philosophy
                    { title: 'Meditations', description: 'Personal writings by Roman Emperor Marcus Aurelius on Stoic philosophy.', year: 180, rating: 4.6, genre: 'Philosophy' },
                    { title: 'The Republic', description: 'Plato\'s philosophical work exploring justice and the ideal state.', year: 380, rating: 4.5, genre: 'Philosophy' },
                    { title: 'Thus Spoke Zarathustra', description: 'Friedrich Nietzsche\'s philosophical novel exploring the Übermensch.', year: 1883, rating: 4.4, genre: 'Philosophy' },
                    { title: 'The Art of War', description: 'An ancient Chinese military treatise on strategy and warfare.', year: 500, rating: 4.3, genre: 'Philosophy' },
                    // Self-Help
                    { title: 'Atomic Habits', description: 'A guide to building good habits and breaking bad ones.', year: 2018, rating: 4.7, genre: 'Self-Help' },
                    { title: 'The 7 Habits of Highly Effective People', description: 'A self-help book outlining seven principles for effectiveness.', year: 1989, rating: 4.6, genre: 'Self-Help' },
                    { title: 'Mindset', description: 'A psychology book exploring fixed and growth mindsets.', year: 2006, rating: 4.5, genre: 'Self-Help' },
                    { title: 'The Power of Now', description: 'A spiritual guide to living in the present moment.', year: 1997, rating: 4.4, genre: 'Self-Help' },
                    // Classic
                    { title: 'Moby Dick', description: 'An epic tale of Captain Ahab\'s obsessive quest for revenge.', year: 1851, rating: 4.2, genre: 'Classic' },
                    { title: 'War and Peace', description: 'A Russian novel set during the Napoleonic Wars.', year: 1869, rating: 4.5, genre: 'Classic' },
                    { title: 'Jane Eyre', description: 'A Gothic romance novel following Jane Eyre as a governess.', year: 1847, rating: 4.4, genre: 'Classic' },
                    { title: 'Wuthering Heights', description: 'A Gothic novel about passionate and destructive love.', year: 1847, rating: 4.3, genre: 'Classic' },
                    // Dystopian
                    { title: 'Brave New World', description: 'A dystopian novel set in a future society with genetic engineering.', year: 1932, rating: 4.5, genre: 'Dystopian' },
                    { title: 'Fahrenheit 451', description: 'A dystopian novel about a future society where books are banned.', year: 1953, rating: 4.4, genre: 'Dystopian' },
                    { title: 'The Giver', description: 'A dystopian novel about a society that has eliminated pain and suffering.', year: 1993, rating: 4.3, genre: 'Dystopian' },
                    { title: 'We', description: 'A dystopian novel about a future society with glass apartments.', year: 1924, rating: 4.3, genre: 'Dystopian' }
                ]
            }
        } else {
            // Story Game
            rec = {
                type: 'story_game',
                title: 'Story-Driven Game',
                description: 'Perfect for deep, immersive gaming experiences with rich narratives!',
                duration: `${(hours / 24).toFixed(1)} days`,
                genre: 'Adventure',
                icon: Gamepad2,
                color: 'from-red-500 to-rose-500',
                examples: [
                    {
                        title: 'God of War',
                        description: 'An epic action-adventure game following Kratos and his son Atreus as they journey through Norse mythology in a quest to fulfill a promise.',
                        year: 2018,
                        rating: 4.8,
                        genre: 'Action, Adventure'
                    },
                    {
                        title: 'The Last of Us',
                        description: 'A post-apocalyptic survival game following Joel and Ellie as they navigate a world ravaged by a fungal infection that turns humans into monsters.',
                        year: 2013,
                        rating: 4.9,
                        genre: 'Action, Survival'
                    },
                    {
                        title: 'Red Dead Redemption 2',
                        description: 'An open-world western action-adventure game following Arthur Morgan and the Van der Linde gang during the decline of the Wild West.',
                        year: 2018,
                        rating: 4.7,
                        genre: 'Action, Adventure, Western'
                    },
                    {
                        title: 'The Witcher 3: Wild Hunt',
                        description: 'An open-world RPG following Geralt of Rivia as he searches for his adopted daughter in a world filled with monsters, magic, and political intrigue.',
                        year: 2015,
                        rating: 4.9,
                        genre: 'RPG, Fantasy'
                    },
                    {
                        title: 'The Legend of Zelda: Breath of the Wild',
                        description: 'An open-world action-adventure game where Link awakens from a 100-year slumber to save Hyrule from Calamity Ganon.',
                        year: 2017,
                        rating: 4.9,
                        genre: 'Action, Adventure'
                    },
                    {
                        title: 'Elden Ring',
                        description: 'An action RPG set in a dark fantasy world where players explore the Lands Between to become the Elden Lord.',
                        year: 2022,
                        rating: 4.8,
                        genre: 'RPG, Fantasy'
                    },
                    {
                        title: 'Cyberpunk 2077',
                        description: 'An open-world action-adventure RPG set in Night City, a megalopolis obsessed with power, glamour, and body modification.',
                        year: 2020,
                        rating: 4.2,
                        genre: 'RPG, Sci-Fi'
                    },
                    {
                        title: 'Horizon Zero Dawn',
                        description: 'An action RPG set in a post-apocalyptic world where robotic creatures dominate the Earth and humans live in primitive tribes.',
                        year: 2017,
                        rating: 4.6,
                        genre: 'Action, RPG'
                    },
                    {
                        title: 'Uncharted 4: A Thief\'s End',
                        description: 'An action-adventure game following Nathan Drake as he embarks on a globe-trotting journey in pursuit of a historical conspiracy.',
                        year: 2016,
                        rating: 4.7,
                        genre: 'Action, Adventure'
                    },
                    {
                        title: 'Mass Effect 2',
                        description: 'A space opera RPG where Commander Shepard must assemble a team to stop the Collectors from abducting human colonies.',
                        year: 2010,
                        rating: 4.8,
                        genre: 'RPG, Sci-Fi'
                    },
                    // RPG
                    { title: 'The Elder Scrolls V: Skyrim', description: 'Open-world RPG where players explore a fantasy realm as the Dragonborn.', year: 2011, rating: 4.7, genre: 'RPG' },
                    { title: 'Persona 5', description: 'JRPG about high school students who become phantom thieves in an alternate reality.', year: 2016, rating: 4.8, genre: 'RPG' },
                    { title: 'Divinity: Original Sin 2', description: 'Tactical turn-based RPG with deep character customization and storytelling.', year: 2017, rating: 4.9, genre: 'RPG' },
                    { title: 'Baldur\'s Gate 3', description: 'Story-rich RPG based on Dungeons & Dragons with tactical combat.', year: 2023, rating: 4.9, genre: 'RPG' },
                    // Action
                    { title: 'Grand Theft Auto V', description: 'Open-world action game following three criminals in Los Santos.', year: 2013, rating: 4.6, genre: 'Action' },
                    { title: 'Red Dead Redemption 2', description: 'Western action-adventure following outlaw Arthur Morgan.', year: 2018, rating: 4.8, genre: 'Action' },
                    { title: 'Spider-Man Remastered', description: 'Superhero action game where players swing through New York as Spider-Man.', year: 2022, rating: 4.7, genre: 'Action' },
                    { title: 'Assassin\'s Creed Valhalla', description: 'Action RPG following a Viking warrior during the Dark Ages.', year: 2020, rating: 4.3, genre: 'Action' },
                    // Adventure
                    { title: 'Uncharted 4', description: 'Action-adventure following treasure hunter Nathan Drake on his final adventure.', year: 2016, rating: 4.7, genre: 'Adventure' },
                    { title: 'Horizon Zero Dawn', description: 'Post-apocalyptic adventure where players hunt robotic creatures.', year: 2017, rating: 4.6, genre: 'Adventure' },
                    { title: 'Tomb Raider', description: 'Adventure game following Lara Croft as she becomes the legendary tomb raider.', year: 2013, rating: 4.4, genre: 'Adventure' },
                    { title: 'A Plague Tale: Innocence', description: 'Adventure game about siblings surviving plague-infested medieval France.', year: 2019, rating: 4.5, genre: 'Adventure' },
                    // Horror
                    { title: 'Resident Evil 4', description: 'Survival horror game where Leon Kennedy rescues the president\'s daughter.', year: 2005, rating: 4.8, genre: 'Horror' },
                    { title: 'Silent Hill 2', description: 'Psychological horror game following James Sunderland searching for his deceased wife.', year: 2001, rating: 4.9, genre: 'Horror' },
                    { title: 'Dead Space', description: 'Sci-fi horror game where an engineer fights alien creatures on a space station.', year: 2008, rating: 4.6, genre: 'Horror' },
                    { title: 'Outlast', description: 'First-person survival horror game set in an abandoned psychiatric hospital.', year: 2013, rating: 4.3, genre: 'Horror' },
                    // Sci-Fi
                    { title: 'Deus Ex: Human Revolution', description: 'Cyberpunk RPG about augmented humans and corporate conspiracy.', year: 2011, rating: 4.5, genre: 'Sci-Fi' },
                    { title: 'Stellaris', description: 'Grand strategy game about building and managing a space-faring empire.', year: 2016, rating: 4.4, genre: 'Sci-Fi' },
                    { title: 'No Man\'s Sky', description: 'Space exploration game with infinite procedurally generated planets.', year: 2016, rating: 4.1, genre: 'Sci-Fi' },
                    { title: 'Half-Life 2', description: 'First-person shooter set in a dystopian world ruled by an alien empire.', year: 2004, rating: 4.8, genre: 'Sci-Fi' },
                    // Fantasy
                    { title: 'Dragon Age: Inquisition', description: 'Fantasy RPG where players lead the Inquisition to save the world.', year: 2014, rating: 4.4, genre: 'Fantasy' },
                    { title: 'Dark Souls III', description: 'Challenging action RPG set in a dark fantasy world.', year: 2016, rating: 4.6, genre: 'Fantasy' },
                    { title: 'Elden Ring', description: 'Open-world fantasy RPG created by FromSoftware and George R.R. Martin.', year: 2022, rating: 4.8, genre: 'Fantasy' },
                    { title: 'The Legend of Zelda: Breath of the Wild', description: 'Open-world adventure game where Link explores the kingdom of Hyrule.', year: 2017, rating: 4.9, genre: 'Fantasy' },
                    // Mystery
                    { title: 'L.A. Noire', description: 'Detective game set in 1940s Los Angeles where players solve crimes.', year: 2011, rating: 4.3, genre: 'Mystery' },
                    { title: 'Sherlock Holmes: Crimes and Punishments', description: 'Detective game where players solve six complex criminal cases.', year: 2014, rating: 4.4, genre: 'Mystery' },
                    { title: 'What Remains of Edith Finch', description: 'Narrative mystery game exploring the tragic history of the Finch family.', year: 2017, rating: 4.6, genre: 'Mystery' },
                    { title: 'Return of the Obra Dinn', description: 'Mystery game where players investigate the fate of a ship\'s crew.', year: 2018, rating: 4.7, genre: 'Mystery' },
                    // Thriller
                    { title: 'Until Dawn', description: 'Interactive thriller where player choices determine who survives the night.', year: 2015, rating: 4.5, genre: 'Thriller' },
                    { title: 'Heavy Rain', description: 'Interactive thriller about a father searching for his kidnapped son.', year: 2010, rating: 4.2, genre: 'Thriller' },
                    { title: 'Alan Wake', description: 'Psychological thriller about a writer trapped in a supernatural nightmare.', year: 2010, rating: 4.3, genre: 'Thriller' },
                    { title: 'Control', description: 'Supernatural thriller where players explore a mysterious government building.', year: 2019, rating: 4.4, genre: 'Thriller' },
                    // Puzzle
                    { title: 'Portal 2', description: 'Puzzle game where players use portal guns to solve increasingly complex challenges.', year: 2011, rating: 4.9, genre: 'Puzzle' },
                    { title: 'The Witness', description: 'Puzzle game set on a mysterious island filled with line-drawing puzzles.', year: 2016, rating: 4.3, genre: 'Puzzle' },
                    { title: 'Baba Is You', description: 'Innovative puzzle game where players manipulate the rules themselves.', year: 2019, rating: 4.6, genre: 'Puzzle' },
                    { title: 'Tetris Effect', description: 'Enhanced version of Tetris with stunning visuals and music.', year: 2018, rating: 4.5, genre: 'Puzzle' }
                ]
            }
        }

        setRecommendation(rec)
        setShowGenreSelection(true)
        setSelectedGenre('')
    }

    const quickTimeOptions = [
        { label: '30 minutes', value: '30 minutes' },
        { label: '1 hour', value: '1 hour' },
        { label: '2 hours', value: '2 hours' },
        { label: '4 hours', value: '4 hours' },
        { label: '1 day', value: '1 day' },
        { label: '2 days', value: '2 days' },
        { label: '1 week', value: '1 week' }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="p-6 space-y-8">
                {/* Header */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 rounded-3xl blur-3xl"></div>
                    <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-slate-700/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent leading-tight">
                                    Recommend Me
                                </h1>
                                <p className="text-slate-600 dark:text-slate-300 mt-2 text-lg">
                                    Tell us how much time you have, and we'll recommend the perfect content
                                </p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                                <Sparkles className="h-8 w-8 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Time Input Section */}
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Clock className="h-5 w-5 text-purple-500" />
                            <span>How much time do you have?</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="e.g., 2 hours, 30 minutes, 1 day..."
                                    value={timeInput}
                                    onChange={(e) => setTimeInput(e.target.value)}
                                    className="h-12 border-slate-200 dark:border-slate-600 focus:border-purple-500 focus:ring-purple-500/20"
                                />
                            </div>
                            <Button
                                onClick={generateRecommendation}
                                className="h-12 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                            >
                                <Zap className="h-4 w-4 mr-2" />
                                Get Recommendation
                            </Button>
                        </div>

                        {/* Quick Time Options */}
                        <div className="space-y-2">
                            <p className="text-sm text-slate-600 dark:text-slate-400">Quick options:</p>
                            <div className="flex flex-wrap gap-2">
                                {quickTimeOptions.map((option) => (
                                    <Button
                                        key={option.value}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setTimeInput(option.value)}
                                        className="h-8 px-3 text-xs border-slate-200 dark:border-slate-600 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                    >
                                        {option.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>


                {/* Recommendation Result */}
                {recommendation && (
                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-3">
                                <div className={`w-12 h-12 bg-gradient-to-r ${recommendation.color} rounded-xl flex items-center justify-center`}>
                                    <recommendation.icon className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <span className="text-2xl">{recommendation.title}</span>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 font-normal">
                                        {recommendation.duration} • {recommendation.genre}
                                    </p>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-slate-700 dark:text-slate-300 text-lg">
                                {recommendation.description}
                            </p>

                            {showGenreSelection && !selectedGenre && (
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                                        What genre interests you most?
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {(() => {
                                            let availableGenres = [];

                                            if (recommendation.type === 'tv') {
                                                availableGenres = [
                                                    'Action', 'Adventure', 'Comedy', 'Drama', 'Romance', 'Crime',
                                                    'Sci-Fi', 'Thriller', 'Fantasy', 'Horror', 'Mystery', 'Family',
                                                    'Animation', 'Documentary', 'Musical', 'Western', 'War'
                                                ];
                                            } else if (recommendation.type === 'movie') {
                                                availableGenres = [
                                                    'Action', 'Adventure', 'Comedy', 'Drama', 'Romance', 'Crime',
                                                    'Sci-Fi', 'Thriller', 'Fantasy', 'Horror', 'Mystery', 'Family',
                                                    'Animation', 'Documentary', 'Musical', 'Western', 'War',
                                                    'Biography'
                                                ];
                                            } else if (recommendation.type === 'live_game') {
                                                availableGenres = [
                                                    'FPS', 'Battle Royale', 'Tactical', 'Survival', 'Strategy',
                                                    'Racing', 'Sports', 'Simulation', 'Action', 'Adventure'
                                                ];
                                            } else if (recommendation.type === 'book') {
                                                availableGenres = [
                                                    'Fiction', 'Non-Fiction', 'Romance', 'Mystery', 'Thriller',
                                                    'Fantasy', 'Sci-Fi', 'Horror', 'Biography', 'History',
                                                    'Philosophy', 'Self-Help', 'Classic', 'Dystopian'
                                                ];
                                            } else if (recommendation.type === 'story_game') {
                                                availableGenres = [
                                                    'RPG', 'Action', 'Adventure', 'Horror', 'Sci-Fi', 'Fantasy',
                                                    'Mystery', 'Thriller', 'Survival', 'Strategy', 'Puzzle'
                                                ];
                                            }

                                            return availableGenres.map((genre) => (
                                                <Button
                                                    key={genre}
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setSelectedGenre(genre)}
                                                    className={`h-8 px-3 text-xs border-slate-200 dark:border-slate-600 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 ${userGenres.includes(genre)
                                                        ? 'border-purple-300 bg-purple-50 dark:bg-purple-900/20'
                                                        : ''
                                                        }`}
                                                >
                                                    {genre}
                                                    {userGenres.includes(genre) && (
                                                        <span className="ml-1 text-purple-600 dark:text-purple-400">★</span>
                                                    )}
                                                </Button>
                                            ));
                                        })()}
                                    </div>
                                </div>
                            )}

                            {selectedGenre && (
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                                        {recommendation.title} Examples in {selectedGenre}:
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {recommendation.examples
                                            .filter(example =>
                                                example.genre &&
                                                example.genre.toLowerCase().includes(selectedGenre.toLowerCase())
                                            )
                                            .slice(0, 4)
                                            .map((example, index) => (
                                                <div
                                                    key={example.title}
                                                    className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600"
                                                >
                                                    <div className="space-y-2">
                                                        <div className="flex items-start justify-between">
                                                            <h5 className="font-semibold text-slate-800 dark:text-slate-200">
                                                                {example.title}
                                                            </h5>
                                                            {example.year && (
                                                                <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded">
                                                                    {example.year}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                                            {example.description}
                                                        </p>
                                                        <div className="flex items-center space-x-3 text-xs">
                                                            {example.rating && (
                                                                <div className="flex items-center space-x-1">
                                                                    <Star className="h-3 w-3 text-amber-500 fill-current" />
                                                                    <span className="text-slate-600 dark:text-slate-400">
                                                                        {example.rating}/10
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {example.genre && (
                                                                <div className="flex flex-wrap gap-1">
                                                                    {example.genre.split(', ').map((genre, idx) => (
                                                                        <Badge
                                                                            key={idx}
                                                                            variant="secondary"
                                                                            className={`text-xs px-2 py-1 ${genre.toLowerCase().includes('action') || genre.toLowerCase().includes('adventure')
                                                                                ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                                                                                : genre.toLowerCase().includes('comedy')
                                                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                                                                    : genre.toLowerCase().includes('drama')
                                                                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                                                                        : genre.toLowerCase().includes('romance')
                                                                                            ? 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300'
                                                                                            : genre.toLowerCase().includes('crime')
                                                                                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                                                                : genre.toLowerCase().includes('sci-fi') || genre.toLowerCase().includes('sci fi')
                                                                                                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                                                                                    : genre.toLowerCase().includes('thriller')
                                                                                                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
                                                                                                        : genre.toLowerCase().includes('fantasy')
                                                                                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                                                                                                            : genre.toLowerCase().includes('rpg')
                                                                                                                ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300'
                                                                                                                : genre.toLowerCase().includes('battle royale')
                                                                                                                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300'
                                                                                                                    : genre.toLowerCase().includes('fps')
                                                                                                                        ? 'bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300'
                                                                                                                        : genre.toLowerCase().includes('tactical')
                                                                                                                            ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300'
                                                                                                                            : genre.toLowerCase().includes('survival')
                                                                                                                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                                                                                                                                : genre.toLowerCase().includes('western')
                                                                                                                                    ? 'bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-300'
                                                                                                                                    : genre.toLowerCase().includes('classic')
                                                                                                                                        ? 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300'
                                                                                                                                        : genre.toLowerCase().includes('fiction')
                                                                                                                                            ? 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300'
                                                                                                                                            : genre.toLowerCase().includes('dystopian')
                                                                                                                                                ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                                                                                                                                                : genre.toLowerCase().includes('family')
                                                                                                                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                                                                                                                    : 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300'
                                                                                }`}
                                                                        >
                                                                            {genre.trim()}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                                <TrendingUp className="h-4 w-4" />
                                <span>Recommendation based on {timeInHours.toFixed(1)} hours of available time</span>
                            </div>
                        </CardContent>
                    </Card>
                )}

            </div>
        </div>
    )
}
